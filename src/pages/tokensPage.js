import React, { useState, useEffect } from "react";
import TokenCard from "../components/tokencard/tokenCard";

const TokensPage = () => {
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/token/user/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData.error);
          throw new Error("Failed to fetch tokens");
        }
        const responseData = await response.json();
        console.log(responseData);

        const transformedTokens = responseData.data.map((token) => ({
          ...token,
          status: token.status, // Map request_status to status
          validUntil:
            token.status === "Pending" ? "..." : token.expiration_date,
        }));

        setTokens(transformedTokens);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <div>Loading tokens...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Tokens</h1>
          <p className="text-gray-600">Manage your gas tank request tokens</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token, index) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
