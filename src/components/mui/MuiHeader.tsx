"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";

interface MuiHeaderProps {
  onStartAssessment: () => void;
  onOpenSignup?: () => void;
  currentUser?: { full_name?: string; [key: string]: unknown } | null;
  onOpenSignIn?: () => void;
  onSignOut?: () => void;
  onOpenProfile?: () => void;
}

export function MuiHeader({
  onStartAssessment,
  onOpenSignup,
  currentUser,
  onOpenSignIn,
  onSignOut,
  onOpenProfile,
}: MuiHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Program Features", href: "#features" },
    { label: "Pricing & Pass", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const is1on1User = Boolean(
    currentUser &&
      (currentUser.partner_route?.includes("8,999") ||
        currentUser.partner_route?.includes("1-on-1") ||
        currentUser.selected_plan === "mentorship_1on1" ||
        (currentUser as any).plan_tier === "mentorship_1on1")
  );

  const isProUser = Boolean(
    currentUser &&
      !is1on1User &&
      (currentUser.partner_route?.includes("4,999") ||
        currentUser.partner_route?.includes("Pro") ||
        currentUser.selected_plan === "pro_all_access" ||
        (currentUser as any).plan_tier === "pro_all_access")
  );

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 70 }}>
          {/* Brand Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <BusinessCenterIcon fontSize="small" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="h6"
                component="a"
                href="/"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                  textDecoration: "none",
                  letterSpacing: "-0.5px",
                }}
              >
                Career<span style={{ color: "#405FE2" }}>Loop</span>
              </Typography>
              <Chip
                icon={<CheckCircleIcon style={{ fontSize: 14, color: "#15803d" }} />}
                label="Career Accelerator Pass"
                size="small"
                variant="outlined"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  borderColor: "rgba(21, 128, 61, 0.3)",
                  color: "#15803d",
                  bgcolor: "rgba(21, 128, 61, 0.08)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
            </Box>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": { color: "text.primary" },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Desktop CTA & Profile Actions */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            {currentUser ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onOpenProfile}
                  startIcon={
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <Avatar
                        src={typeof currentUser.photo_url === "string" ? currentUser.photo_url : undefined}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 26,
                          height: 26,
                          fontSize: "0.75rem",
                          border: is1on1User
                            ? "2px solid #000000"
                            : isProUser
                            ? "2px solid #f59e0b"
                            : "none",
                          boxShadow: is1on1User
                            ? "0 0 0 2px #facc15, 0 0 8px rgba(250, 204, 21, 0.7)"
                            : isProUser
                            ? "0 0 8px rgba(245, 158, 11, 0.7)"
                            : "none",
                        }}
                      >
                        {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 14 }} />}
                      </Avatar>
                      {is1on1User && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -5,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "#000000",
                            color: "#facc15",
                            fontSize: "8px",
                            fontWeight: 900,
                            lineHeight: 1,
                            px: "3.5px",
                            py: "1px",
                            borderRadius: "3px",
                            border: "1px solid #facc15",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.6), 0 0 6px rgba(250,204,21,0.5)",
                            letterSpacing: "0.04em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          1o1
                        </Box>
                      )}
                      {isProUser && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -4,
                            right: -5,
                            bgcolor: "#f59e0b",
                            color: "#000",
                            fontSize: "8px",
                            fontWeight: 900,
                            lineHeight: 1,
                            px: "3px",
                            py: "1px",
                            borderRadius: "4px",
                            border: "1px solid #ffffff",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          PRO
                        </Box>
                      )}
                    </Box>
                  }
                  sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    px: 1.8,
                    py: 0.6,
                  }}
                >
                  My Profile
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={onStartAssessment}
                  sx={{ fontWeight: 700, textTransform: "none", px: 2, py: 0.6, borderRadius: 2 }}
                >
                  Take Free Baseline Test
                </Button>
                {onSignOut && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={onSignOut}
                    sx={{ color: "text.secondary", fontSize: "0.82rem", textTransform: "none" }}
                  >
                    Sign Out
                  </Button>
                )}
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {onOpenSignIn && (
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={onOpenSignIn}
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      px: 1.5,
                      borderRadius: 2,
                      "&:hover": {
                        color: "text.primary",
                        bgcolor: "rgba(0, 0, 0, 0.04)",
                      },
                    }}
                  >
                    Candidate Login
                  </Button>
                )}
                {onOpenSignup && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenSignup}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "0.9rem",
                      px: 2.8,
                      py: 0.9,
                      borderRadius: 2,
                      bgcolor: "#405FE2",
                      boxShadow: "0 4px 14px rgba(64, 95, 226, 0.35)",
                      "&:hover": {
                        bgcolor: "#2843be",
                        boxShadow: "0 6px 18px rgba(64, 95, 226, 0.5)",
                      },
                    }}
                  >
                    Get CareerLoop Pro
                  </Button>
                )}
              </Box>
            )}
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: "background.paper",
              p: 2,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Career<span style={{ color: "#405FE2" }}>Loop</span>
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {currentUser ? (
            <>
              <ListItem disablePadding sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenProfile?.();
                  }}
                  startIcon={
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <Avatar
                        src={typeof currentUser.photo_url === "string" ? currentUser.photo_url : undefined}
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          width: 24,
                          height: 24,
                          fontSize: "0.7rem",
                          border: is1on1User
                            ? "2px solid #000000"
                            : isProUser
                            ? "2px solid #f59e0b"
                            : "none",
                          boxShadow: is1on1User
                            ? "0 0 0 2px #facc15, 0 0 8px rgba(250, 204, 21, 0.7)"
                            : isProUser
                            ? "0 0 6px rgba(245, 158, 11, 0.7)"
                            : "none",
                        }}
                      >
                        {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 14 }} />}
                      </Avatar>
                      {is1on1User && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            bgcolor: "#000000",
                            color: "#facc15",
                            fontSize: "7px",
                            fontWeight: 900,
                            lineHeight: 1,
                            px: "2.5px",
                            py: "0.5px",
                            borderRadius: "3px",
                            border: "1px solid #facc15",
                            letterSpacing: "0.03em",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          1o1
                        </Box>
                      )}
                      {isProUser && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -3,
                            right: -4,
                            bgcolor: "#f59e0b",
                            color: "#000",
                            fontSize: "7px",
                            fontWeight: 900,
                            lineHeight: 1,
                            px: "2px",
                            py: "0.5px",
                            borderRadius: "3px",
                            border: "1px solid #ffffff",
                          }}
                        >
                          PRO
                        </Box>
                      )}
                    </Box>
                  }
                  sx={{ fontWeight: 700, textTransform: "none", py: 1 }}
                >
                  My Profile ({currentUser.full_name || "Candidate"})
                </Button>
              </ListItem>
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    setMobileOpen(false);
                    onSignOut?.();
                  }}
                  sx={{ color: "text.secondary", textTransform: "none" }}
                >
                  Sign Out
                </Button>
              </ListItem>
            </>
          ) : (
            <>
              {onOpenSignIn && (
                <ListItem disablePadding sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenSignIn();
                    }}
                    sx={{ textTransform: "none", fontWeight: 600, py: 1 }}
                  >
                    Candidate Login
                  </Button>
                </ListItem>
              )}
              {onOpenSignup && (
                <ListItem disablePadding sx={{ mt: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenSignup();
                    }}
                    sx={{ textTransform: "none", fontWeight: 700, py: 1 }}
                  >
                    Get CareerLoop Pro
                  </Button>
                </ListItem>
              )}
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
