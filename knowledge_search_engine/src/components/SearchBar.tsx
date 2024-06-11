"use client";

import { useEffect, useRef, useState } from "react";
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
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";
import MicIcon from "@mui/icons-material/Mic";
import Image from "next/image";

interface Suggestion {
  word: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //const router = useRouter();
  const [recognizing, setRecognizing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [language, setLanguage] = useState("zh-CN");
  const suggestionListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported by this browser.");
      return;
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionListRef.current &&
        !suggestionListRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchEnglishSuggestions = async (query: string) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://api.datamuse.com/sug?s=${query}`
      );
      setSuggestions(response.data);
      setShowSuggestions(true); // Open suggestions list when new suggestions are fetched
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchChineseSuggestions = async (query: string) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `https://suggestion.baidu.com/su?wd=${query}&cb=callback`
      );
      const data = JSON.parse(response.data.match(/callback\((.*)\)/)[1]);
      setSuggestions(data.s.map((term: string) => ({ word: term })));
      setShowSuggestions(true); // Open suggestions list when new suggestions are fetched
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchSuggestions = (query: string) => {
    if (language == "en-US") {
      fetchEnglishSuggestions(query);
    } else {
      fetchChineseSuggestions(query);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    fetchSuggestions(searchTerm);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.word);
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
    recognition.lang = language;

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
      <div className="flex justify-center mb-4"></div>
      <div className="flex justify-center mb-4">
        <RadioGroup onChange={setLanguage} value={language} colorScheme="cyan">
          <Stack direction="row" spacing={6}>
            <Radio value="zh-CN">
              <text className=" text-slate-950">中文</text>
            </Radio>
            <Radio value="en-US">
              <text className=" text-slate-950">English</text>
            </Radio>
          </Stack>
        </RadioGroup>
      </div>
      <Stack direction="row" spacing={4} alignItems="center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white text-zinc-950  "
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

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionListRef}
          className="absolute w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.word}
            </li>
          ))}
        </ul>
      )}

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
