"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPlayerValues = exports.playerSchema = void 0;
const zod_1 = require("zod");
exports.playerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(20, "Name must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Name can only contain letters, numbers, underscores, and hyphens"),
    role: zod_1.z.enum(["Assaulter", "Sniper", "Support"], {
        required_error: "Please select a role",
    }),
    specialization: zod_1.z
        .string()
        .min(2, "Specialization must be at least 2 characters")
        .max(30, "Specialization must be less than 30 characters"),
    kdRatio: zod_1.z
        .number()
        .min(0, "K/D ratio cannot be negative")
        .max(10, "K/D ratio cannot exceed 10")
        .refine((val) => Number(val.toFixed(2)) === val, "K/D ratio can have at most 2 decimal places"),
    rank: zod_1.z.number().int("Rank must be a whole number").min(1, "Rank must be at least 1").max(5, "Rank cannot exceed 5"),
    status: zod_1.z.enum(["Active", "Inactive", "Benched"], {
        required_error: "Please select a status",
    }),
    avatar: zod_1.z.string().optional(),
    matchesPlayed: zod_1.z.number().int("Matches played must be a whole number").min(0, "Matches played cannot be negative"),
    winRate: zod_1.z.number().min(0, "Win rate cannot be negative").max(100, "Win rate cannot exceed 100%"),
    joinDate: zod_1.z.string().min(1, "Join date is required"),
    lastActive: zod_1.z.string().min(1, "Last active date is required"),
});
exports.defaultPlayerValues = {
    name: "",
    role: undefined,
    specialization: "",
    kdRatio: 1.0,
    rank: 3,
    status: "Active",
    avatar: "",
    matchesPlayed: 0,
    winRate: 0,
    joinDate: new Date().toISOString().split("T")[0],
    lastActive: new Date().toISOString().split("T")[0],
};
