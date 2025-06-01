"use client";
import { TemplateGallery } from "./template-gallery";

import { DocumentsTable } from "./documents-table";
import { useSearchParam } from "@/hooks/use-search-param";
import { useOrg } from "@/providers/org-context";
import { useEffect, useState } from "react";

import axios from "@/config/axiosConfig";

export default function Home() {
  return (
    <>
      <div className="p-4">
        <TemplateGallery />
        <DocumentsTable />
      </div>
    </>
  );
}
