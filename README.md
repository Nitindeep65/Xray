# X-Ray Debugging System

A Next.js application that provides deep visibility into multi-step AI/ML pipelines by capturing and explaining **why** each decision was made.

## The Problem

When AI systems make decisions through multiple steps, it's often unclear why a particular outcome occurred. X-Ray solves this by recording every step's inputs, outputs, reasoning, and confidence scores.

## Features

- **X-Ray SDK** - Lightweight library to instrument any pipeline
- **Step-by-Step Tracing** - Captures inputs, outputs, reasoning, and evaluations
- **Dashboard UI** - Visual timeline to explore each decision
- **Dark Mode** - Clean UI with shadcn/ui components

## Demo Pipeline: Hiring Screener

A 4-step resume screening pipeline:
1. **Parse Resume** - Extracts skills, experience, education
2. **Tech Filter** - Evaluates technical requirements
3. **Culture Fit** - Assesses soft skills and values
4. **Final Selection** - Combines scores for final decision

## Quick Start

```bash
npm install
npm run dev