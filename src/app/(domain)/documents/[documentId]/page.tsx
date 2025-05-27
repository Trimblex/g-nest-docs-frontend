"use client";
import React from "react";

import { Document } from "./document";
import { useParams } from "next/navigation";

const DocumentIdPage = () => {
  const params = useParams();

  return <Document documentId={params.documentId as string} />;
};

export default DocumentIdPage;
