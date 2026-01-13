import React, { useMemo, useState } from "react";
import OpenAI from "openai";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  TextField,
  Button,
  LinearProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import { AutoAwesome, RestartAlt, Send } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";

type ChatAuthor = "user" | "assistant";

interface ChatMessage {
  id: number;
  author: ChatAuthor;
  text: string;
  createdAt: Date;
}

const createInitialAssistantMessage = (): ChatMessage => ({
  id: Date.now(),
  author: "assistant",
  text:
    "Hi! I'm your AI career guide. Tell me your skills, interests, and study/work background. I'll suggest possible paths for you.",
  createdAt: new Date(),
});

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const openAiClient = apiKey
  ? new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
  : null;

const systemPrompt =
  "You are a concise, encouraging career guide for students and early-career technologists. Give clear bullet points, specific next steps, and highlight skills to build. Keep replies under 160 words.";

const quickPrompts = [
  {
    label: "90-day roadmap",
    prompt:
      "Give me a focused 90-day roadmap to land an entry-level tech role. Include weekly milestones, portfolio pieces, and what to practice.",
  },
  {
    label: "Skill gap check",
    prompt:
      "Here is my background. What are my top 3 skill gaps and how do I close them with a weekly schedule?",
  },
  {
    label: "Interview prep",
    prompt:
      "Create a two-week interview prep plan with daily drills for behavioral, system design, and coding fundamentals.",
  },
  {
    label: "Portfolio ideas",
    prompt:
      "Suggest three portfolio projects that make me hireable. Include stack, scope, and success criteria.",
  },
];

const CareerGuidePage: React.FC = () => {
  const theme = useTheme();
  const [promptInput, setPromptInput] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([createInitialAssistantMessage()]);
  const [loading, setLoading] = useState(false);

  const contextSummary = useMemo(
    () => contextInput.trim() || "No extra context provided.",
    [contextInput]
  );

  const handleSendMessage = async () => {
    const trimmed = promptInput.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      author: "user",
      text: trimmed,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPromptInput("");
    setLoading(true);

    const recentMessages = [...messages, userMessage].slice(-6);
    const historyContext = recentMessages
      .map((msg) => `${msg.author === "assistant" ? "Assistant" : "User"}: ${msg.text}`)
      .join("\n");

    try {
      let aiText =
        "OpenAI API key is missing. Add REACT_APP_OPENAI_API_KEY to your .env and restart the app.";

      if (openAiClient) {
        const response = await openAiClient.responses.create({
          model: "gpt-5-nano",
          input: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `User context: ${contextSummary}\n\nConversation snapshot:\n${historyContext ||
                "No history yet."}\n\nAnswer the latest question with concise steps, skill gaps, and next actions.`,
            },
          ],
        });

        aiText =
          response.output_text?.trim() ??
          "I couldn't generate a reply just now. Please try again.";
      }

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        author: "assistant",
        text: aiText,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const aiMessage: ChatMessage = {
        id: Date.now() + 2,
        author: "assistant",
        text: "Sorry, I couldn't reach the career engine. Please try again.",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([createInitialAssistantMessage()]);
    setPromptInput("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 5,
        px: { xs: 1.5, sm: 3 },
        background: `radial-gradient(circle at 22% 12%, ${alpha(
          theme.palette.primary.main,
          0.16
        )}, transparent 32%), radial-gradient(circle at 80% 0%, ${alpha(
          theme.palette.secondary.main,
          0.14
        )}, transparent 30%), linear-gradient(180deg, ${alpha(
          theme.palette.background.default,
          0.98
        )}, ${alpha(theme.palette.background.default, 0.9)})`,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2 } }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "18px",
                background: alpha(theme.palette.primary.main, 0.12),
                display: "grid",
                placeItems: "center",
                boxShadow: `0 18px 45px ${alpha(theme.palette.primary.main, 0.28)}`,
              }}
            >
              <AutoAwesome color="primary" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                Career Dev Console
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A conversational AI room for clarity, next steps, and interview prep.
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<AutoAwesome />}
            label="Live AI guidance"
            variant="outlined"
            sx={{
              borderRadius: 999,
              borderColor: alpha(theme.palette.primary.main, 0.4),
              fontWeight: 600,
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "340px 1fr" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              p: 2.5,
              background: alpha(theme.palette.background.paper, 0.82),
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                letterSpacing: 0.4,
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Session setup
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
              Add your context
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Summarize your background, target roles, and constraints. The assistant will
              weave this into every reply.
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              maxRows={6}
              placeholder="Your background, current role, desired role, or constraints..."
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
              Jump in with a prompt
            </Typography>
            <Stack spacing={1}>
              {quickPrompts.map((item) => (
                <Button
                  key={item.label}
                  variant="outlined"
                  onClick={() => setPromptInput(item.prompt)}
                  endIcon={<Send fontSize="small" />}
                  sx={{
                    justifyContent: "space-between",
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
              Tip: Edit the prompt after selecting to tailor it to your story.
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              background: `linear-gradient(180deg, ${alpha(
                theme.palette.background.paper,
                0.78
              )}, ${alpha(theme.palette.background.paper, 0.9)})`,
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              boxShadow: "0 30px 90px rgba(0,0,0,0.2)",
              minHeight: { xs: "70vh", md: "75vh" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                background: alpha(theme.palette.background.default, 0.85),
                backdropFilter: "blur(8px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Chat stream
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Looks and flows like a modern AI chat: alternate bubbles, sticky composer, quick follow ups.
                </Typography>
              </Box>
              <IconButton
                aria-label="Clear chat"
                onClick={handleClearChat}
                disabled={loading}
                sx={{
                  border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                  borderRadius: 2,
                  color: "text.secondary",
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.text.primary,
                  },
                }}
              >
                <RestartAlt />
              </IconButton>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: { xs: 2, sm: 3 },
                py: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "flex-start",
                    flexDirection: msg.author === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        msg.author === "user"
                          ? alpha(theme.palette.primary.main, 0.25)
                          : theme.palette.primary.main,
                      color:
                        msg.author === "user"
                          ? theme.palette.text.primary
                          : theme.palette.common.white,
                      boxShadow:
                        msg.author === "assistant"
                          ? `0 18px 40px ${alpha(theme.palette.primary.main, 0.4)}`
                          : "none",
                    }}
                  >
                    {msg.author === "user" ? "You" : <AutoAwesome fontSize="small" />}
                  </Avatar>
                  <Box
                    sx={{
                      flex: 1,
                      maxWidth: "100%",
                      p: 1.5,
                      borderRadius: 2.5,
                      background:
                        msg.author === "user"
                          ? alpha(theme.palette.primary.main, 0.08)
                          : alpha(theme.palette.background.default, 0.9),
                      border: `1px solid ${alpha(
                        msg.author === "user"
                          ? theme.palette.primary.main
                          : theme.palette.divider,
                        msg.author === "user" ? 0.4 : 0.7
                      )}`,
                      boxShadow:
                        msg.author === "assistant"
                          ? "0 18px 40px rgba(0,0,0,0.08)"
                          : "none",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                      }}
                    >
                      {msg.author === "user" ? "You" : "Career Guide"}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {loading && (
              <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1 }}>
                <LinearProgress />
              </Box>
            )}

            <Box
              sx={{
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                p: { xs: 2, sm: 3 },
                background: alpha(theme.palette.background.default, 0.92),
                backdropFilter: "blur(8px)",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-end">
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={6}
                  placeholder="Ask naturally: goals, skills, timeframe, roadblocks..."
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  onClick={handleSendMessage}
                  disabled={loading || !promptInput.trim()}
                  sx={{
                    alignSelf: "stretch",
                    borderRadius: 2,
                    px: 2.5,
                  }}
                >
                  Send
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CareerGuidePage;
