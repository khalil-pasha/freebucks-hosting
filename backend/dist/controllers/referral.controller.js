"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralController = void 0;
const referral_service_1 = require("../services/referral.service");
class ReferralController {
    static async claim(req, res) {
        try {
            // In this specific mock, the user claiming might be the referrer,
            // and we need to pass both referrerId and referredId.
            const userId = req.user.id;
            const { referredId } = req.body;
            if (!referredId) {
                return res.status(400).json({ error: 'referredId is required' });
            }
            const data = await referral_service_1.ReferralService.claimReferralReward(userId, referredId);
            res.json(data);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.ReferralController = ReferralController;
