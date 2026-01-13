import React, { FormEvent, useEffect, useMemo, useState } from "react";
import OpenAI from "openai";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Button,
  Link,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

// ✅ IMPORT YOUR IMAGE
import badgeImage from "../images/123.png";

type ChatMessage = {
  id: number;
  author: "bot" | "user";
  text: string;
  sources?: string[];
  images?: string[];
};

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const vectorStoreId = process.env.REACT_APP_OPENAI_VECTOR_STORE_ID;

const openAiClient = apiKey
  ? new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
  : null;

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    author: "bot",
    text: "Hi! I'm Don Bosco. Ask me anything about our courses or campus.",
  },
];

const SCOPE_TOPICS = [
  "dbit",
  "don bosco",
  "kilinochchi",
  "school of excellence",
  "jaffna",
];

const TypingIndicator: React.FC = () => (
  <Box
    sx={{
      px: 1.5,
      py: 1,
      borderRadius: 1,
      display: "inline-flex",
      gap: 0.75,
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(6px)",
      border: "1px solid rgba(0,0,0,0.05)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      "@keyframes typingBlink": {
        "0%": { opacity: 0.3 },
        "50%": { opacity: 1 },
        "100%": { opacity: 0.3 },
      },
    }}
  >
    {[0, 1, 2].map((index) => (
      <Box
        key={index}
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "primary.main",
          animation: "typingBlink 1.2s infinite",
          animationDelay: `${index * 0.18}s`,
        }}
      />
    ))}
  </Box>
);

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [promptCycle, setPromptCycle] = useState(0);

  const scrollContainerId = useMemo(
    () => `chat-scroll-${Math.random().toString(36).slice(2)}`,
    []
  );

  const handleToggle = () => setOpen((prev) => !prev);

  const pushMessage = (message: ChatMessage) =>
    setMessages((prev) => [...prev, message]);

  useEffect(() => {
    const interval = setInterval(() => setPromptCycle((prev) => prev + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = document.getElementById(scrollContainerId);
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, scrollContainerId]);

  const tools = useMemo(() => {
    type Tool =
      | { type: "web_search" }
      | { type: "file_search"; vector_store_ids: string[] };

    const list: Tool[] = [{ type: "web_search" }];
    if (vectorStoreId) {
      list.push({
        type: "file_search",
        vector_store_ids: [vectorStoreId],
      });
    }
    return list;
  }, [vectorStoreId]);

  const getBotReply = async (value: string) => {
    if (!openAiClient) {
      return {
        text: "OpenAI API key is missing. Add REACT_APP_OPENAI_API_KEY to your .env and restart the app.",
        sources: [],
        images: [],
      };
    }

    const normalized = value.toLowerCase();
    const inScope = SCOPE_TOPICS.some((topic) => normalized.includes(topic));
    if (!inScope) {
      return {
        text: "I can help with DBIT Kilinochchi, Don Bosco School of Excellence, or Don Bosco Jaffna. Please ask about those.",
        sources: [],
        images: [],
      };
    }

    const response = await openAiClient.responses.create({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are Don Bosco, the assistant for DBIT Kilinochchi, Don Bosco School of Excellence, and Don Bosco Jaffna. When you use web_search or files, include direct URLs for sources and any image URLs that help illustrate your answer.",
        },
        {
          role: "user",
          content: value,
        },
      ],
      tools,
      tool_choice: "auto",
    });

    const safeText =
      response.output_text?.trim() ||
      "I couldn't generate a reply just now. Please try again.";

    const urlRegex = /(https?:\/\/[^\s)]+)/g;
    const allUrls = new Set<string>();
    const imageUrls = new Set<string>();

    const addUrl = (raw?: string) => {
      if (!raw) return;
      const cleaned = raw.replace(/[,.;]+$/, "");
      if (!cleaned.startsWith("http")) return;
      allUrls.add(cleaned);
      if (/\.(png|jpe?g|gif|webp|svg)$/i.test(cleaned)) {
        imageUrls.add(cleaned);
      }
    };

    const extractFromContent = (content: any) => {
      if (!content) return;
      content.forEach((block: any) => {
        if (block?.type === "text") {
          block.text?.annotations?.forEach((ann: any) => addUrl(ann?.url));
          const matches = block.text?.value?.match?.(urlRegex) || [];
          matches.forEach((match: string) => addUrl(match));
        }
        if (block?.type === "image_url") {
          addUrl(block.image_url?.url);
        }
      });
    };

    response.output?.forEach((out: any) => {
      extractFromContent(out?.content);
      out?.citations?.forEach?.((citation: any) => addUrl(citation?.url));
      out?.metadata?.citations?.forEach?.((citation: any) =>
        addUrl(citation?.url)
      );
    });

    const textMatches = safeText.match(urlRegex) || [];
    textMatches.forEach((match: string) => addUrl(match));

    return {
      text: safeText,
      sources: Array.from(allUrls),
      images: Array.from(imageUrls),
    };
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      author: "user",
      text: input.trim(),
    };

    pushMessage(userMessage);
    setInput("");

    setSending(true);

    try {
      const botReply = await getBotReply(userMessage.text);
      pushMessage({
        id: Date.now() + 1,
        author: "bot",
        text: botReply.text,
        sources: botReply.sources,
        images: botReply.images,
      });
    } catch (error) {
      console.error(error);
      pushMessage({
        id: Date.now() + 2,
        author: "bot",
        text: "Sorry, I ran into an issue reaching Don Bosco. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 12, sm: 16, md: 24 },
        right: { xs: 12, sm: 16, md: 24 },
        zIndex: 2500,
      }}
    >
      {open && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            mb: 1.5,
          }}
        >
          {/* Don Bosco Image - visible on md screens and up */}
          <Box
            component="img"
            src={badgeImage}
            alt="Don Bosco"
            sx={{
              display: { xs: 'none', md: 'block' },
              height: { md: 380, lg: 420 },
              width: 'auto',
              objectFit: 'contain',
              mr: -2,
              zIndex: 1,
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
            }}
          />

          <Paper
            elevation={12}
            sx={{
              width: { xs: 'calc(100vw - 24px)', sm: 360, md: 380 },
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: { xs: 'calc(100vh - 140px)', sm: 420, md: 460 },
              maxHeight: { xs: 500, sm: 'none' },
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                background:
                  "linear-gradient(135deg, rgba(110, 3, 3, 0.95), rgba(212, 0, 11, 0.85))",
                color: "common.white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Don Bosco
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Typically replies in a minute
                </Typography>
              </Box>

              <IconButton size="small" onClick={handleToggle} sx={{ color: "white" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Chat Area */}
            <Box
              id={scrollContainerId}
              sx={{
                px: 2,
                py: 2,
                flexGrow: 1,
                overflowY: "auto",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))",
              }}
            >
              <Stack spacing={1.5}>
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.author === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Stack
                      spacing={0.75}
                      alignItems={
                        msg.author === "user" ? "flex-end" : "flex-start"
                      }
                      sx={{ maxWidth: "80%" }}
                    >
                      <Box
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 1,
                          backgroundColor:
                            msg.author === "user"
                              ? "rgba(255, 0, 0, 0.85)"
                              : "rgba(255,255,255,0.7)",
                          color:
                            msg.author === "user" ? "common.white" : "grey.900",
                          fontSize: 14,
                          lineHeight: 1.45,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {msg.text}
                      </Box>

                      {msg.sources && msg.sources.length > 0 && (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          rowGap={0.25}
                          sx={{ fontSize: 12 }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "rgba(0,0,0,0.6)" }}
                          >
                            Sources:
                          </Typography>
                          {msg.sources.map((url, index) => (
                            <Link
                              key={`${url}-${index}`}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              variant="caption"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {`Link ${index + 1}`}
                            </Link>
                          ))}
                        </Stack>
                      )}

                      {msg.images && msg.images.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {msg.images.map((url, index) => (
                            <Box
                              key={`${url}-${index}`}
                              component="a"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                width: 72,
                                height: 72,
                                borderRadius: 1,
                                overflow: "hidden",
                                border: "1px solid rgba(0,0,0,0.08)",
                                boxShadow: "0 6px 12px rgba(0,0,0,0.16)",
                                backgroundColor: "rgba(255,255,255,0.7)",
                              }}
                            >
                              <Box
                                component="img"
                                src={url}
                                alt="search result"
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                ))}

                {sending && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <TypingIndicator />
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Input Box */}
            <Box
              component="form"
              onSubmit={handleSend}
              sx={{
                p: 1.5,
                borderTop: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <Stack direction="row" spacing={1}>
                <TextField
                  variant="outlined"
                  size="small"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type a message..."
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Floating Chat Button */}
      <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        {!open && (
          <Box
            key={promptCycle}
            sx={{
              mr: 1.5,
              px: 1.25,
              py: 0.75,
              borderRadius: 1,
              backgroundColor: "rgba(0,0,0,0.72)",
              color: "common.white",
              fontSize: 13,
              whiteSpace: "nowrap",
              overflow: "hidden",
              borderRight: "2px solid rgba(255,255,255,0.85)",
              animation:
                "typing 2.2s steps(16, end) forwards, blink 0.8s step-end infinite",
              "@keyframes typing": {
                from: { width: 0 },
                to: { width: "16ch" },
              },
              "@keyframes blink": {
                "50%": { borderColor: "transparent" },
              },
              boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
              pointerEvents: "none",
            }}
          >
            Ask Help Anytime
          </Box>
        )}

        <IconButton
          onClick={handleToggle}
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "primary.main",
            color: "common.white",
            boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatWidget;
