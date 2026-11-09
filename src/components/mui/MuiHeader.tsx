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
    { label: "Roadmap", href: "#how-it-works" },
    { label: "Compensation & Terms", href: "#placement-terms" },
    { label: "FAQ", href: "#faq" },
  ];

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
                label="Pay Upon Interview / Offer"
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
                    <Avatar sx={{ bgcolor: "primary.main", color: "white", width: 24, height: 24, fontSize: "0.75rem" }}>
                      {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 14 }} />}
                    </Avatar>
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
                  Take Assessment
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
                    sx={{ fontWeight: 600, color: "text.secondary", textTransform: "none" }}
                  >
                    Candidate Login
                  </Button>
                )}
                {onOpenSignup && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={onOpenSignup}
                    sx={{ fontWeight: 600, textTransform: "none", px: 2, borderRadius: 2 }}
                  >
                    Sign Up
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onStartAssessment}
                  sx={{ fontWeight: 600, px: 2.5, textTransform: "none", borderRadius: 2 }}
                >
                  Take Assessment
                </Button>
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
                    <Avatar sx={{ bgcolor: "primary.main", color: "white", width: 22, height: 22, fontSize: "0.7rem" }}>
                      {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 14 }} />}
                    </Avatar>
                  }
                  sx={{ fontWeight: 700, textTransform: "none" }}
                >
                  My Profile ({currentUser.full_name || "Candidate"})
                </Button>
              </ListItem>
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setMobileOpen(false);
                    onStartAssessment();
                  }}
                  sx={{ fontWeight: 700, textTransform: "none" }}
                >
                  Take Assessment
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
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Candidate Login
                  </Button>
                </ListItem>
              )}
              {onOpenSignup && (
                <ListItem disablePadding sx={{ mt: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenSignup();
                    }}
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    Sign Up Free
                  </Button>
                </ListItem>
              )}
              <ListItem disablePadding sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setMobileOpen(false);
                    onStartAssessment();
                  }}
                  sx={{ textTransform: "none", fontWeight: 700 }}
                >
                  Take Assessment
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
}
