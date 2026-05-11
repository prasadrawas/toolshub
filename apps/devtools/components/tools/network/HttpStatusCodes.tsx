"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, ChevronRight } from "lucide-react";

const STATUS_CODES: { code: number; name: string; description: string; category: string }[] = [
  { code: 100, name: "Continue", description: "The server has received the request headers and the client should proceed to send the request body.", category: "1xx" },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols and the server has agreed.", category: "1xx" },
  { code: 102, name: "Processing", description: "The server has received and is processing the request, but no response is available yet.", category: "1xx" },
  { code: 103, name: "Early Hints", description: "Used to return some response headers before final HTTP message.", category: "1xx" },
  { code: 200, name: "OK", description: "The request has succeeded.", category: "2xx" },
  { code: 201, name: "Created", description: "The request has been fulfilled and a new resource has been created.", category: "2xx" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing, but the processing has not been completed.", category: "2xx" },
  { code: 203, name: "Non-Authoritative Information", description: "The returned meta-information is from a cached copy.", category: "2xx" },
  { code: 204, name: "No Content", description: "The server successfully processed the request and is not returning any content.", category: "2xx" },
  { code: 205, name: "Reset Content", description: "The server successfully processed the request but is not returning any content. Requires the requester to reset the document view.", category: "2xx" },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource due to a range header sent by the client.", category: "2xx" },
  { code: 207, name: "Multi-Status", description: "The message body contains multiple status codes for multiple independent operations.", category: "2xx" },
  { code: 301, name: "Moved Permanently", description: "The resource has been moved to a new URL permanently.", category: "3xx" },
  { code: 302, name: "Found", description: "The resource has been found at a different URL temporarily.", category: "3xx" },
  { code: 303, name: "See Other", description: "The response can be found under a different URL using GET.", category: "3xx" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified since the last request.", category: "3xx" },
  { code: 307, name: "Temporary Redirect", description: "The request should be repeated with another URL but future requests should still use the original URL.", category: "3xx" },
  { code: 308, name: "Permanent Redirect", description: "The request and all future requests should be repeated using another URL.", category: "3xx" },
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to a client error.", category: "4xx" },
  { code: 401, name: "Unauthorized", description: "Authentication is required and has failed or has not been provided.", category: "4xx" },
  { code: 402, name: "Payment Required", description: "Reserved for future use. Sometimes used for digital payment systems.", category: "4xx" },
  { code: 403, name: "Forbidden", description: "The client does not have access rights to the content.", category: "4xx" },
  { code: 404, name: "Not Found", description: "The server cannot find the requested resource.", category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: "The request method is known by the server but not supported by the target resource.", category: "4xx" },
  { code: 406, name: "Not Acceptable", description: "The server cannot produce a response matching the acceptable values defined in the request headers.", category: "4xx" },
  { code: 407, name: "Proxy Authentication Required", description: "The client must first authenticate itself with the proxy.", category: "4xx" },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request.", category: "4xx" },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state of the server.", category: "4xx" },
  { code: 410, name: "Gone", description: "The requested resource is no longer available and will not be available again.", category: "4xx" },
  { code: 411, name: "Length Required", description: "The request did not specify the length of its content, which is required.", category: "4xx" },
  { code: 412, name: "Precondition Failed", description: "The server does not meet one of the preconditions in the request headers.", category: "4xx" },
  { code: 413, name: "Payload Too Large", description: "The request is larger than the server is willing or able to process.", category: "4xx" },
  { code: 414, name: "URI Too Long", description: "The URI provided was too long for the server to process.", category: "4xx" },
  { code: 415, name: "Unsupported Media Type", description: "The media format of the requested data is not supported by the server.", category: "4xx" },
  { code: 416, name: "Range Not Satisfiable", description: "The range specified in the Range header cannot be fulfilled.", category: "4xx" },
  { code: 418, name: "I'm a Teapot", description: "The server refuses the attempt to brew coffee with a teapot (RFC 2324).", category: "4xx" },
  { code: 422, name: "Unprocessable Entity", description: "The request was well-formed but had semantic errors.", category: "4xx" },
  { code: 429, name: "Too Many Requests", description: "The user has sent too many requests in a given amount of time.", category: "4xx" },
  { code: 451, name: "Unavailable For Legal Reasons", description: "The resource is unavailable due to legal demands.", category: "4xx" },
  { code: 500, name: "Internal Server Error", description: "The server has encountered an unexpected condition.", category: "5xx" },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality required to fulfill the request.", category: "5xx" },
  { code: 502, name: "Bad Gateway", description: "The server received an invalid response from the upstream server.", category: "5xx" },
  { code: 503, name: "Service Unavailable", description: "The server is not ready to handle the request, often due to maintenance or overload.", category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: "The server is acting as a gateway and cannot get a response in time.", category: "5xx" },
  { code: 505, name: "HTTP Version Not Supported", description: "The HTTP version used in the request is not supported.", category: "5xx" },
  { code: 507, name: "Insufficient Storage", description: "The server is unable to store the representation needed to complete the request.", category: "5xx" },
  { code: 511, name: "Network Authentication Required", description: "The client needs to authenticate to gain network access.", category: "5xx" },
];

const CATEGORIES = ["All", "1xx", "2xx", "3xx", "4xx", "5xx"];
const CATEGORY_COLORS: Record<string, string> = {
  "1xx": "text-blue-600 bg-blue-50",
  "2xx": "text-green-600 bg-green-50",
  "3xx": "text-yellow-600 bg-yellow-50",
  "4xx": "text-orange-600 bg-orange-50",
  "5xx": "text-red-600 bg-red-50",
};

export default function HttpStatusCodes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = STATUS_CODES.filter((s) => {
    const matchesCategory = category === "All" || s.category === category;
    const matchesSearch =
      !search ||
      String(s.code).includes(search) ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, name, or description..."
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                category === cat ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {filtered.map((status) => (
          <div key={status.code} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === status.code ? null : status.code)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className={cn("rounded-lg px-2 py-0.5 text-sm font-bold font-mono", CATEGORY_COLORS[status.category])}>
                {status.code}
              </span>
              <span className="text-sm font-medium text-gray-800 flex-1">{status.name}</span>
              {expanded === status.code ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            {expanded === status.code && (
              <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-100 pt-2">
                {status.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-8">No matching status codes found</div>
      )}
    </div>
  );
}
