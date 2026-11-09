"use client";

import React from "react";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export function MuiWhatsAppButton() {
  const handleOpenWhatsApp = () => {
    const phoneNumber = "919876543210";
    const text = encodeURIComponent(
      "Hi careerloop Support, I want to know more about the proctored skill assessment and recruitment partner interview scheduling."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
  };

  return (
    <Tooltip title="Chat with Placement Helpdesk" placement="left" arrow>
      <Fab
        color="success"
        aria-label="whatsapp support"
        onClick={handleOpenWhatsApp}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "#25D366",
          color: "#ffffff",
          boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)",
          "&:hover": {
            bgcolor: "#20ba59",
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
          zIndex: 1000,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 30 }} />
      </Fab>
    </Tooltip>
  );
}
