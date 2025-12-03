"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BusinessCardData } from "@/types/business-card";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export const columns: ColumnDef<BusinessCardData>[] = [
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent hover:text-cbre-green"
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "mobile",
        header: "Mobile",
    },
    {
        accessorKey: "officeName",
        header: "Office",
    },
];
