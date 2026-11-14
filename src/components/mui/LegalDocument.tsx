"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { LEGAL_LINKS } from "@/lib/legal/meta";
import type { LegalBlock, LegalDocumentData } from "@/lib/legal/types";

/**
 * Shared renderer for the three public legal documents. Content is plain data
 * (`src/lib/legal/*.ts`); this component only handles structure, numbering,
 * anchors, placeholder highlighting and cross-linking.
 *
 * Anything written as [UPPER_SNAKE_CASE] is treated as an unresolved fact and
 * highlighted, so a draft can never quietly ship looking finished.
 */
// The capture group is required: String.split keeps captured delimiters.
const PLACEHOLDER = /(\[[A-Z][A-Z0-9_]+\])/g;

function withPlaceholders(text: string): React.ReactNode {
  const parts = text.split(PLACEHOLDER);
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Box
        component="span"
        key={i}
        sx={{
          px: 0.5,
          py: 0.1,
          borderRadius: 0.75,
          bgcolor: "#fef3c7",
          color: "#92400e",
          border: "1px dashed #d97706",
          fontWeight: 600,
          whiteSpace: "nowrap",
          fontSize: "0.92em",
        }}
      >
        {part}
      </Box>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

function Blocks({
  blocks,
  prefix,
}: {
  blocks: LegalBlock[];
  prefix: string;
}) {
  let clause = 0;

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.t) {
          case "clause": {
            clause += 1;
            return (
              <Box
                key={i}
                sx={{ display: "flex", gap: 1.5, mb: 1.5, alignItems: "flex-start" }}
              >
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    minWidth: 42,
                    flexShrink: 0,
                    pt: "2px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {prefix}
                  {clause}
                </Typography>
                <Typography
                  component="p"
                  variant="body2"
                  sx={{ lineHeight: 1.75, color: "text.primary", m: 0 }}
                >
                  {withPlaceholders(block.text)}
                </Typography>
              </Box>
            );
          }

          case "defs": {
            clause += 1;
            return (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      minWidth: 42,
                      flexShrink: 0,
                      pt: "2px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {prefix}
                    {clause}
                  </Typography>
                  <Box
                    component="dl"
                    sx={{
                      m: 0,
                      flex: 1,
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "minmax(140px, 210px) 1fr" },
                      columnGap: 2,
                      rowGap: 1,
                    }}
                  >
                    {block.items.map((item) => (
                      <React.Fragment key={item.term}>
                        <Typography
                          component="dt"
                          variant="body2"
                          sx={{ fontWeight: 650, color: "text.primary" }}
                        >
                          {withPlaceholders(item.term)}
                        </Typography>
                        <Typography
                          component="dd"
                          variant="body2"
                          sx={{ m: 0, color: "text.primary", lineHeight: 1.7 }}
                        >
                          {withPlaceholders(item.text)}
                        </Typography>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          }

          case "ul":
            return (
              <Box
                component="ul"
                key={i}
                sx={{ mt: 0.5, mb: 2, pl: 3, "& li": { mb: 0.75 } }}
              >
                {block.items.map((item, j) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={j}
                    sx={{ lineHeight: 1.7, color: "text.primary" }}
                  >
                    {withPlaceholders(item)}
                  </Typography>
                ))}
              </Box>
            );

          case "ol":
            return (
              <Box
                component="ol"
                key={i}
                sx={{ mt: 0.5, mb: 2, pl: 3, "& li": { mb: 0.75 } }}
              >
                {block.items.map((item, j) => (
                  <Typography
                    component="li"
                    variant="body2"
                    key={j}
                    sx={{ lineHeight: 1.7, color: "text.primary" }}
                  >
                    {withPlaceholders(item)}
                  </Typography>
                ))}
              </Box>
            );

          case "table":
            return (
              <TableContainer
                key={i}
                component={Paper}
                elevation={0}
                sx={{
                  my: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflowX: "auto",
                }}
              >
                <Table size="small" sx={{ minWidth: 520 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "rgba(64, 95, 226, 0.06)" }}>
                      {block.head.map((cell) => (
                        <TableCell
                          key={cell}
                          sx={{ fontWeight: 700, color: "text.primary", fontSize: "0.8rem" }}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {block.rows.map((row, r) => (
                      <TableRow key={r} sx={{ "&:last-child td": { border: 0 } }}>
                        {row.map((cell, c) => (
                          <TableCell
                            key={c}
                            sx={{
                              verticalAlign: "top",
                              fontSize: "0.8rem",
                              lineHeight: 1.6,
                              color: "text.primary",
                              ...(c === 0 ? { fontWeight: 600, minWidth: 130 } : {}),
                            }}
                          >
                            {withPlaceholders(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );

          case "h3":
            return (
              <Typography
                key={i}
                component="h3"
                variant="subtitle1"
                sx={{ fontWeight: 700, mt: 3, mb: 1, color: "text.primary" }}
              >
                {withPlaceholders(block.text)}
              </Typography>
            );

          case "note":
            return (
              <Box
                key={i}
                sx={{
                  mt: 1.5,
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: "rgba(64, 95, 226, 0.05)",
                  borderLeft: "3px solid",
                  borderColor: "primary.main",
                }}
              >
                <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {withPlaceholders(block.text)}
                </Typography>
              </Box>
            );

          case "p":
          default:
            return (
              <Typography
                key={i}
                component="p"
                variant="body2"
                sx={{ lineHeight: 1.8, color: "text.primary", mb: 1.5 }}
              >
                {withPlaceholders(block.text)}
              </Typography>
            );
        }
      })}
    </>
  );
}

export function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  const others = LEGAL_LINKS.filter((link) => link.href !== doc.slug);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f4f7fe", pb: 10 }}>
      {/* Top bar */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.5 }}>
            <Link
              href="/"
              underline="hover"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              CareerLoop
            </Link>
            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {doc.shortTitle}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 } }}>
        {/* Heading block */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <GavelOutlinedIcon sx={{ color: "primary.main", fontSize: 22 }} />
            <Typography
              variant="overline"
              sx={{ color: "primary.main", fontWeight: 700, letterSpacing: "0.08em" }}
            >
              Legal
            </Typography>
          </Box>
          <Typography
            component="h1"
            variant="h3"
            sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.25rem" }, mb: 1 }}
          >
            {doc.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Version {doc.version} · Last updated {doc.lastUpdated} · Effective{" "}
            {withPlaceholders(doc.effectiveDate)}
          </Typography>
        </Box>

        {doc.draft && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ mb: 3, borderRadius: 2, bgcolor: "#fffbeb" }}
          >
            <strong>Draft for legal review.</strong> This document is published in draft
            form while the Company&apos;s details and certain policy positions are being
            settled. Highlighted fields are placeholders that are not yet final.
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "240px minmax(0, 1fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          {/* Table of contents */}
          <Box
            component="nav"
            aria-label="Contents"
            sx={{
              position: { md: "sticky" },
              top: { md: 80 },
              display: { xs: "none", md: "block" },
              maxHeight: { md: "calc(100vh - 100px)" },
              overflowY: { md: "auto" },
              pr: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Contents
            </Typography>
            <Box component="ol" sx={{ listStyle: "none", m: 0, mt: 1, p: 0 }}>
              {doc.sections.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`#${section.id}`}
                    underline="none"
                    sx={{
                      display: "flex",
                      gap: 1,
                      py: 0.5,
                      fontSize: "0.78rem",
                      lineHeight: 1.35,
                      color: "text.secondary",
                      borderRadius: 1,
                      "&:hover": { color: "primary.main", bgcolor: "rgba(64,95,226,0.06)" },
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 700, minWidth: 16 }}>
                      {section.number}
                    </Box>
                    <Box component="span">{section.heading}</Box>
                  </Link>
                </li>
              ))}
            </Box>
          </Box>

          {/* Document body */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              maxWidth: 860,
            }}
          >
            {doc.intro.map((paragraph, i) => (
              <Typography
                key={i}
                variant="body2"
                sx={{ lineHeight: 1.85, color: "text.primary", mb: 1.75 }}
              >
                {withPlaceholders(paragraph)}
              </Typography>
            ))}

            <Divider sx={{ my: 3 }} />

            {doc.sections.map((section) => (
              <Box
                key={section.id}
                component="section"
                id={section.id}
                sx={{ mb: 4, scrollMarginTop: 90 }}
              >
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{
                    fontWeight: 750,
                    fontSize: { xs: "1.02rem", sm: "1.1rem" },
                    color: "text.primary",
                    mb: 1.5,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {/^\d+$/.test(section.number) && (
                    <Box component="span" sx={{ color: "primary.main" }}>
                      {section.number}.
                    </Box>
                  )}
                  <Box component="span">{section.heading}</Box>
                </Typography>

                <Blocks
                  blocks={section.blocks}
                  prefix={`${section.number}.`}
                />
              </Box>
            ))}

            {/* Cross-links */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Related documents
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
              {others.map((link) => (
                <Typography component="li" variant="body2" key={link.href} sx={{ mb: 0.5 }}>
                  <Link href={link.href} underline="hover" sx={{ fontWeight: 600 }}>
                    {link.label}
                  </Link>
                </Typography>
              ))}
            </Box>

            {/* Version footer */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {doc.shortTitle} · Version {doc.version} · Last updated {doc.lastUpdated}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                © {new Date().getFullYear()} CareerLoop. All rights reserved.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Below-body links for small screens */}
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Link href="/" underline="hover" variant="body2" sx={{ fontWeight: 600 }}>
            Back to CareerLoop
          </Link>
          {others.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              underline="hover"
              variant="body2"
              sx={{ fontWeight: 600 }}
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
