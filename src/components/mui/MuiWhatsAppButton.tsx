"use client";

import React from "react";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export function MuiWhatsAppButton() {
  const handleOpenWhatsApp = () => {
    // Community group invite (was a placeholder wa.me number).
    window.open(
      "https://chat.whatsapp.com/Kg2SW9a4rYRIvJ8R5gFhGC",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Tooltip title="Join the CareerLoop WhatsApp group" placement="left" arrow>
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
