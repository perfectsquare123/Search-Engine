"use client";

import { useState } from "react";
import axios from "axios";
import { Button, ButtonGroup, Link, Stack } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface Suggestion {
  id: number;
  term: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //const router = useRouter();

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
    </div>
  );
}
