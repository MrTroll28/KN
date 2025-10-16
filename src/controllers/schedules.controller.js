import { query, body, validationResult } from "express-validator";
import {
  listMySchedules,
  upsertDaySlots,
  bulkCreateWeeks,
  summarizeWeek,
} from "../services/schedules.service.js";

export const listValidators = [
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
];

export async function getMine(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { from, to } = req.query;
    const data = await listMySchedules(req.user.id, from, to);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export const setDayValidators = [
  body("date").isISO8601(),
  body("slots")
    .isArray()
    .custom((arr) => arr.every((x) => typeof x === "string")),
  body("note").optional().isString(),
];

export async function postSetDay(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { date, slots, note } = req.body;
    const data = await upsertDaySlots(req.user.id, date, slots, note);
    res.status(201).json({ count: data.length });
  } catch (e) {
    next(e);
  }
}

export const bulkWeekValidators = [
  body("startDate").isISO8601(),
  body("weeks").optional().isInt({ min: 1, max: 52 }),
  body("daysOfWeek")
    .isArray()
    .custom((a) => a.every((n) => Number.isInteger(n) && n >= 0 && n <= 6)),
  body("slots")
    .isArray()
    .custom((arr) => arr.every((x) => typeof x === "string")),
  body("note").optional().isString(),
];

export async function postBulkWeeks(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { startDate, weeks = 1, daysOfWeek, slots, note } = req.body;
    const rows = await bulkCreateWeeks(
      req.user.id,
      startDate,
      weeks,
      daysOfWeek,
      slots,
      note
    );
    res.status(201).json({ inserted: rows.length });
  } catch (e) {
    next(e);
  }
}

export async function getSummary(req, res, next) {
  try {
    const { from, to } = req.query;
    const data = await summarizeWeek(from, to);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
