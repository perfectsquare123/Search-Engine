"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Container,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";
import MicIcon from "@mui/icons-material/Mic";
import Image from "next/image";

interface Suggestion {
  id: number;
  term: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //const router = useRouter();
  const [recognizing, setRecognizing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported by this browser.");
      return;
    }
  }, []);

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      try {
        const response = await axios.get(`/api/searchResults?q=${searchTerm}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetcing suggestions: ", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    fetchSuggestions(searchTerm);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.term);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    if (query) {
      //router.push(`/searchResults?q=${query}`);
    }
  };

  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    //recognition.lang = "en-US";
    recognition.lang = "zh-CN";

    recognition.onstart = () => {
      setRecognizing(true);
      onOpen();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      fetchSuggestions(transcript);
      setRecognizing(false);
      onClose();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setRecognizing(false);
      onClose();
    };

    recognition.onend = () => {
      setRecognizing(false);
      onClose();
    };

    recognition.start();
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-5">
      <Stack direction="row" spacing={4} alignItems="center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-zinc-950  "
          placeholder="搜索"
        />

        <Button
          rightIcon={<Search2Icon />}
          colorScheme="teal"
          variant="solid"
          onClick={handleSearch}
          paddingLeft={2}
        ></Button>
        <Button onClick={startRecognition} colorScheme="blue" variant="solid">
          <MicIcon />
        </Button>
      </Stack>

      {/*showSuggestions && suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.term}
            </li>
          ))}
        </ul>
      )*/}

      <text className="text-slate-950">{query}</text>
      <div className="justify-center align-middle">
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Listening...</ModalHeader>
            <ModalBody>
              <div className="mb-3">
                <Image
                  src="/microphone_remove_bg.png"
                  alt="micrphone image"
                  width={400}
                  height={270}
                />
              </div>
              <div className="justify-center flex mb-3">
                <h4 className="text-2xl font-sans">Try speak something!</h4>
              </div>
              <div className="justify-center flex">
                <h4 className="text-2xl font-sans">您说，我在听~</h4>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
