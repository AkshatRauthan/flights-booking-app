const express = require('express');
const router = express.Router();

const { EmailController } = require('../../controllers');

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     summary: Create a ticket
 *     tags: [Tickets]
 *     responses:
 *       201:
 *         description: Ticket created
 */
router.post(
    '/tickets',
    EmailController.createTicket
);

module.exports = router;