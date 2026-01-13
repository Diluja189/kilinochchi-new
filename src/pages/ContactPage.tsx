import React, { useState } from "react";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";

import { insertAdmissionsEnquiry } from "../api/admissionsApi";
import { insertAngelInvestmentEnquiry } from "../api/angelInvestmentApi";
import { insertSeedFundingEnquiry } from "../api/seedFundingApi";
import { insertRemoteEmploymentEnquiry } from "../api/remoteEmploymentApi";

type FormType = "admissions" | "angel" | "seed" | "remote";

type ContactCard = {
  title: string;
  description?: string;
  icon: React.ReactNode;
  formType?: FormType;
};

//
// ⭐ ONLY 4 CARDS NOW — All fake/info cards removed
//
const contacts: ContactCard[] = [
  {
    title: "Admissions Desk",
    icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 36 }} />,
    formType: "admissions",
  },
  {
    title: "Angel Investment",
    description: "Invest in campus labs, startups & innovation programs.",
    icon: <RocketLaunchRoundedIcon sx={{ fontSize: 36 }} />,
    formType: "angel",
  },
  {
    title: "Seed Funding",
    description: "Support student startups from concept to MVP.",
    icon: <VolunteerActivismRoundedIcon sx={{ fontSize: 36 }} />,
    formType: "seed",
  },
  {
    title: "Remote Employment",
    description: "Hire skilled graduates for global remote roles.",
    icon: <WorkOutlineRoundedIcon sx={{ fontSize: 36 }} />,
    formType: "remote",
  },
];

const ContactPage: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<ContactCard | null>(
    null
  );

  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 🎓 Admissions form
  const [admissionsForm, setAdmissionsForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: "",
  });

  const courseOptions = [
    "Full Stack Development",
    "AI & Machine Learning",
    "Software Engineering",
    "Networking",
    "Cyber Security",
    "Other",
  ];

  // 💸 Angel Investment
  const [angelForm, setAngelForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    investment_range: "",
    message: "",
  });

  // 🚀 Seed Funding
  const [seedForm, setSeedForm] = useState({
    name: "",
    phone: "",
    email: "",
    startup_name: "",
    funding_stage: "",
    message: "",
  });

  // 🌍 Remote Employment
  const [remoteForm, setRemoteForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    skills: "",
    message: "",
  });

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255,255,255,0.7)" },
      "&:hover fieldset": { borderColor: "#f2c94c" },
      "&.Mui-focused fieldset": { borderColor: "#f2c94c" },
    },
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiFormLabel-root": { color: "rgba(255,255,255,0.7)" },
    "& .MuiFormLabel-root.Mui-focused": { color: "#f2c94c" },
  };

  const handleCardClick = (contact: ContactCard) => {
    if (contact.formType) setActiveForm(contact.formType);
    else setSelectedContact(contact);
  };

  const closeDetailsDialog = () => setSelectedContact(null);
  const closeFormDialog = () => setActiveForm(null);

  // ------------ SUBMIT FUNCTIONS (unchanged) ------------

  const handleSubmitAdmissions = async () => {
    const { name, phone, email, course, message } = admissionsForm;
    if (!name || !phone || !email || !course) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      setSubmitting(true);
      await insertAdmissionsEnquiry({ name, phone, email, course, message });
      alert("Your admissions enquiry has been submitted!");
      setActiveForm(null);
      setAdmissionsForm({ name: "", phone: "", email: "", course: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAngel = async () => {
    const { name, phone, email, company, investment_range, message } = angelForm;
    if (!name || !phone || !email) {
      alert("Name, phone, and email are required.");
      return;
    }
    try {
      setSubmitting(true);
      await insertAngelInvestmentEnquiry({
        name,
        phone,
        email,
        company,
        investment_range,
        message,
      });
      alert("Your angel investment enquiry has been submitted!");
      setActiveForm(null);
      setAngelForm({
        name: "",
        phone: "",
        email: "",
        company: "",
        investment_range: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSeed = async () => {
    const { name, phone, email, startup_name, funding_stage, message } = seedForm;
    if (!name || !phone || !email) {
      alert("Name, phone, and email are required.");
      return;
    }
    try {
      setSubmitting(true);
      await insertSeedFundingEnquiry({
        name,
        phone,
        email,
        startup_name,
        funding_stage,
        message,
      });
      alert("Your seed funding enquiry has been submitted!");
      setActiveForm(null);
      setSeedForm({
        name: "",
        phone: "",
        email: "",
        startup_name: "",
        funding_stage: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRemote = async () => {
    const { name, phone, email, role, skills, message } = remoteForm;
    if (!name || !phone || !email) {
      alert("Name, phone, and email are required.");
      return;
    }
    try {
      setSubmitting(true);
      await insertRemoteEmploymentEnquiry({
        name,
        phone,
        email,
        role,
        skills,
        message,
      });
      alert("Your remote employment enquiry has been submitted!");
      setActiveForm(null);
      setRemoteForm({
        name: "",
        phone: "",
        email: "",
        role: "",
        skills: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      id="contact"
      sx={{ position: "relative", py: { xs: 12, md: 16 }, overflow: "hidden" }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Contact"
          title="Talk to the Kilinochchi team"
          subtitle="Pick a desk below to get quick answers."
        />

        <Box
          sx={{
            mt: 6,
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {contacts.map((contact) => (
            <GlowCard
              key={contact.title}
              onClick={() => handleCardClick(contact)}
              sx={{
                cursor: "pointer",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {contact.icon}
                </Box>

                <Typography variant="subtitle1" fontWeight={700}>
                  {contact.title}
                </Typography>
              </Stack>

              {contact.description && (
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  {contact.description}
                </Typography>
              )}

              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {contact.formType
                  ? "Tap to submit an enquiry"
                  : "Tap to view details"}
              </Typography>
            </GlowCard>
          ))}
        </Box>
      </Container>

      {/* ---------- MODALS BELOW (unchanged) ---------- */}
      {/* Admissions */}
      <Dialog
        open={activeForm === "admissions"}
        onClose={closeFormDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(160deg,#050e23,#0f2046)",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.3)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Admissions Enquiry Form</Typography>
          <IconButton onClick={closeFormDialog} sx={{ color: "white" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              fullWidth
              value={admissionsForm.name}
              onChange={(e) =>
                setAdmissionsForm({ ...admissionsForm, name: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={admissionsForm.phone}
              onChange={(e) =>
                setAdmissionsForm({ ...admissionsForm, phone: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Email"
              fullWidth
              value={admissionsForm.email}
              onChange={(e) =>
                setAdmissionsForm({ ...admissionsForm, email: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              select
              label="Course Interested"
              fullWidth
              value={admissionsForm.course}
              onChange={(e) =>
                setAdmissionsForm({ ...admissionsForm, course: e.target.value })
              }
              sx={textFieldSx}
            >
              {courseOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={admissionsForm.message}
              onChange={(e) =>
                setAdmissionsForm({ ...admissionsForm, message: e.target.value })
              }
              sx={textFieldSx}
            />
            <Button
              variant="contained"
              onClick={handleSubmitAdmissions}
              disabled={submitting}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                background: "linear-gradient(90deg,#d4a017,#f2c94c,#d4a017)",
                color: "#050e23",
              }}
            >
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ANGEL */}
      <Dialog
        open={activeForm === "angel"}
        onClose={closeFormDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(160deg,#050e23,#0f2046)",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.3)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Angel Investment Enquiry</Typography>
          <IconButton onClick={closeFormDialog} sx={{ color: "white" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              fullWidth
              value={angelForm.name}
              onChange={(e) =>
                setAngelForm({ ...angelForm, name: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={angelForm.phone}
              onChange={(e) =>
                setAngelForm({ ...angelForm, phone: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Email"
              fullWidth
              value={angelForm.email}
              onChange={(e) =>
                setAngelForm({ ...angelForm, email: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Company / Organisation"
              fullWidth
              value={angelForm.company}
              onChange={(e) =>
                setAngelForm({ ...angelForm, company: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Approximate Investment Range"
              placeholder="e.g. USD 10k - 50k"
              fullWidth
              value={angelForm.investment_range}
              onChange={(e) =>
                setAngelForm({
                  ...angelForm,
                  investment_range: e.target.value,
                })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={angelForm.message}
              onChange={(e) =>
                setAngelForm({ ...angelForm, message: e.target.value })
              }
              sx={textFieldSx}
            />
            <Button
              variant="contained"
              onClick={handleSubmitAngel}
              disabled={submitting}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                background: "linear-gradient(90deg,#d4a017,#f2c94c,#d4a017)",
                color: "#050e23",
              }}
            >
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* SEED */}
      <Dialog
        open={activeForm === "seed"}
        onClose={closeFormDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(160deg,#050e23,#0f2046)",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.3)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Seed Funding Enquiry</Typography>
          <IconButton onClick={closeFormDialog} sx={{ color: "white" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              fullWidth
              value={seedForm.name}
              onChange={(e) =>
                setSeedForm({ ...seedForm, name: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={seedForm.phone}
              onChange={(e) =>
                setSeedForm({ ...seedForm, phone: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Email"
              fullWidth
              value={seedForm.email}
              onChange={(e) =>
                setSeedForm({ ...seedForm, email: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Startup Name"
              fullWidth
              value={seedForm.startup_name}
              onChange={(e) =>
                setSeedForm({ ...seedForm, startup_name: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Funding Stage"
              placeholder="Idea / MVP / Pre-Seed / Seed"
              fullWidth
              value={seedForm.funding_stage}
              onChange={(e) =>
                setSeedForm({ ...seedForm, funding_stage: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={seedForm.message}
              onChange={(e) =>
                setSeedForm({ ...seedForm, message: e.target.value })
              }
              sx={textFieldSx}
            />
            <Button
              variant="contained"
              onClick={handleSubmitSeed}
              disabled={submitting}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                background: "linear-gradient(90deg,#d4a017,#f2c94c,#d4a017)",
                color: "#050e23",
              }}
            >
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* REMOTE */}
      <Dialog
        open={activeForm === "remote"}
        onClose={closeFormDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(160deg,#050e23,#0f2046)",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.3)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Remote Employment Enquiry</Typography>
          <IconButton onClick={closeFormDialog} sx={{ color: "white" }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5}>
            <TextField
              label="Full Name"
              fullWidth
              value={remoteForm.name}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, name: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={remoteForm.phone}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, phone: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Email"
              fullWidth
              value={remoteForm.email}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, email: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Role / Position Interested In"
              fullWidth
              value={remoteForm.role}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, role: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Key Skills / Tech Stack"
              fullWidth
              value={remoteForm.skills}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, skills: e.target.value })
              }
              sx={textFieldSx}
            />
            <TextField
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={remoteForm.message}
              onChange={(e) =>
                setRemoteForm({ ...remoteForm, message: e.target.value })
              }
              sx={textFieldSx}
            />
            <Button
              variant="contained"
              onClick={handleSubmitRemote}
              disabled={submitting}
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                background: "linear-gradient(90deg,#d4a017,#f2c94c,#d4a017)",
                color: "#050e23",
              }}
            >
              {submitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-140px",
            right: "-120px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(128,0,0,0.27) 0%, transparent 70%)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-200px",
            left: "-140px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,160,23,0.24) 0%, transparent 70%)",
          },
        }}
      />
    </Box>
  );
};

export default ContactPage;
