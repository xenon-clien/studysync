const ExamPrepPack = require('../models/ExamPrepPack');
const { SEM1_2_PACKS } = require('./examPacks/sem1_2');
const { SEM3_PACKS } = require('./examPacks/sem3');
const { SEM4_PACKS } = require('./examPacks/sem4');
const { SEM5_PACKS } = require('./examPacks/sem5');
const { SEM6_7_8_PACKS } = require('./examPacks/sem6_7_8');
const { ETT_PACKS } = require('./examPacks/ett');

const CURATED_PACKS = [
  ...SEM1_2_PACKS,
  ...SEM3_PACKS,
  ...SEM4_PACKS,
  ...SEM5_PACKS,
  ...SEM6_7_8_PACKS,
  ...ETT_PACKS,
];

exports.CURATED_PACKS = CURATED_PACKS;

exports.seedExamPrepPacks = async () => {
  try {
    for (const pack of CURATED_PACKS) {
      await ExamPrepPack.findOneAndUpdate(
        {
          course: pack.course,
          subject: pack.subject,
          isGlobal: true,
        },
        { $set: pack },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log(`Exam Prep packs synced (${CURATED_PACKS.length} curated packs with full 1-6 units across all semesters).`);
  } catch (err) {
    console.warn('Exam Prep seed skipped:', err.message);
  }
};
