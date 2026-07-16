"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/health").then((response) => {
      setMessage(response.data.message);
    });
  }, []);

  return (
    <main>
      <h1>{message}</h1>
    </main>
  );
}