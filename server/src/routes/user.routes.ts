import { Router } from "express";
import {
  logout,
  login,
  register,
  getAllUsers,
} from "../controllers/user.controller";

const router = Router();

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Validation error or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.route("/register").post(register);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a user and obtain a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Invalid credentials supplied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.route("/login").post(login);

/**
 * @openapi
 * /api/user/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Invalidate the current session token
 *     responses:
 *       200:
 *         description: Logout acknowledgement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.route("/logout").post(logout);

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve all users
 *     description: Returns a list of registered users. Password hashes are omitted.
 *     responses:
 *       200:
 *         description: List of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 */
router.route("/").get(getAllUsers);

export default router;
