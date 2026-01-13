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
  Alert,
} from "@mui/material";

import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import Diversity2RoundedIcon from "@mui/icons-material/Diversity2Rounded";
import VolunteerActivismRoundedIcon from "@mui/icons-material/VolunteerActivismRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import GlowCard from "../components/GlowCard";
import SectionHeader from "../components/SectionHeader";
import { insertAdmissionsEnquiry } from "../api/admissionsApi";

type ContactCard = {
  title: string;
  person?: string;
  role?: string;
  phone?: string;
  email?: string;
  description?: string;
  icon: React.ReactNode;
};

const contacts: ContactCard[] = [
  {
    title: "Admissions Desk",
    icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Industry Partnerships",
    person: "Suren Dias",
    role: "Head of Partnerships",
    phone: "+94 77 922 4500",
    email: "industry@dbinfotech.lk",
    description:
      "Collaborations for residencies, recruitment, and sponsored projects.",
    icon: <MapsHomeWorkRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Student Affairs",
    person: "Nishan Wickramasinghe",
    role: "Community Director",
    phone: "+94 21 228 7812",
    email: "community@dbinfotech.lk",
    description: "Campus life, clubs, housing, and wellbeing support.",
    icon: <SupportAgentRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Alumni Network",
    person: "Hamsika Liyanage",
    role: "Alumni Catalyst",
    phone: "+94 77 244 2199",
    email: "alumni@dbinfotech.lk",
    description: "Connect with graduates working across the globe.",
    icon: <Diversity2RoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Donor Relations",
    person: "Fr. Michael Soosa",
    role: "Director",
    phone: "+94 77 313 4511",
    email: "donors@dbinfotech.lk",
    description: "Support scholarships, labs, and social impact initiatives.",
    icon: <VolunteerActivismRoundedIcon sx={{ fontSize: 36 }} />,
  },
  {
    title: "Global Collaborations",
    person: "Aathithan Raj",
    role: "International Programs",
    phone: "+65 8887 9033",
    email: "global@dbinfotech.lk",
    description: "Joint research, study abroad, and exchange opportunities.",
    icon: <PublicRoundedIcon sx={{ fontSize: 36 }} />,
  },
];

const Contactdirectory: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<ContactCard | null>(
    null
  );

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
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
    if (contact.title === "Admissions Desk") {
      setSuccessMsg("");
      setErrorMsg("");
      setFormOpen(true);
    } else {
      setSelectedContact(contact);
    }
  };

  const closeDetailsDialog = () => setSelectedContact(null);

  const closeFormDialog = () => {
    if (submitting) return;
    setFormOpen(false);
  };

  const handleFormChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      course: formData.course.trim(),
      message: formData.message.trim(),
    };

    if (
      !payload.name ||
      !payload.phone ||
      !payload.email ||
      !payload.course ||
      !payload.message
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      await insertAdmissionsEnquiry(payload);

      setSuccessMsg("Your enquiry has been submitted successfully.");

      setFormData({
        name: "",
        phone: "",
        email: "",
        course: "",
        message: "",
      });

      setTimeout(() => {
        setFormOpen(false);
        setSuccessMsg("");
      }, 900);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      id="contact-directory"
      sx={{
        position: "relative",
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <SectionHeader
          eyebrow="Contact Directory"
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

                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {contact.title}
                  </Typography>
                  {contact.role && (
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {contact.role}
                    </Typography>
                  )}
                </Box>
              </Stack>

              {contact.description && (
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  {contact.description}
                </Typography>
              )}

              {contact.person && (
                <Typography variant="body2" fontWeight={600}>
                  {contact.person}
                </Typography>
              )}

              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {contact.title === "Admissions Desk"
                  ? "Tap to submit an admission enquiry"
                  : "Tap to view contact details"}
              </Typography>
            </GlowCard>
          ))}
        </Box>
      </Container>

      {/* DETAILS MODAL */}
      <Dialog
        open={Boolean(selectedContact)}
        onClose={closeDetailsDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background:
              "linear-gradient(160deg, rgba(5, 14, 35, 0.96), rgba(15, 32, 70, 0.96))",
            borderRadius: 3,
            border: "1px solid rgba(212,160,23,0.3)",
            color: "#fff5ea",
          },
        }}
      >
        {selectedContact && (
          <>
            <DialogTitle
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Box>
                <Typography variant="h6">{selectedContact.title}</Typography>
                {selectedContact.role && (
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {selectedContact.role}
                  </Typography>
                )}
              </Box>

              <IconButton onClick={closeDetailsDialog} sx={{ color: "white" }}>
                <CloseRoundedIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={1.5}>
                {selectedContact.person && (
                  <Typography fontWeight={600}>
                    {selectedContact.person}
                  </Typography>
                )}
                {selectedContact.phone && (
                  <Typography>Phone: {selectedContact.phone}</Typography>
                )}
                {selectedContact.email && (
                  <Typography>Email: {selectedContact.email}</Typography>
                )}
                {selectedContact.description && (
                  <Typography sx={{ opacity: 0.7 }}>
                    {selectedContact.description}
                  </Typography>
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ADMISSIONS FORM MODAL */}
      <Dialog
        open={formOpen}
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
          <IconButton
            onClick={closeFormDialog}
            sx={{ color: "white" }}
            disabled={submitting}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2}>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            {successMsg && <Alert severity="success">{successMsg}</Alert>}

            <TextField
              required
              name="name"
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={handleFormChange}
              sx={textFieldSx}
            />

            <TextField
              required
              name="phone"
              label="Phone Number"
              fullWidth
              value={formData.phone}
              onChange={handleFormChange}
              sx={textFieldSx}
            />

            <TextField
              required
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleFormChange}
              sx={textFieldSx}
            />

            <TextField
              required
              select
              name="course"
              label="Course Interested"
              fullWidth
              value={formData.course}
              onChange={handleFormChange}
              sx={textFieldSx}
            >
              {courseOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              name="message"
              label="Message"
              fullWidth
              multiline
              rows={3}
              value={formData.message}
              onChange={handleFormChange}
              sx={textFieldSx}
            />

            <Button
              variant="contained"
              onClick={handleFormSubmit}
              disabled={submitting}
              sx={{
                mt: 0.5,
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

      {/* Background glowing circles */}
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

export default Contactdirectory;
