
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createProgramInputSchema,
  updateProgramInputSchema,
  createDepartmentInputSchema,
  updateDepartmentInputSchema,
  createSchoolEventInputSchema,
  updateSchoolEventInputSchema,
  createAchievementInputSchema,
  updateAchievementInputSchema,
  createNewsArticleInputSchema,
  updateNewsArticleInputSchema,
  createAlumniInputSchema,
  updateAlumniInputSchema,
  createStudentRegistrationInputSchema,
  updateStudentRegistrationStatusInputSchema,
  idParamSchema
} from './schema';

// Import handlers
import { getPrograms } from './handlers/get_programs';
import { createProgram } from './handlers/create_program';
import { updateProgram } from './handlers/update_program';
import { deleteProgram } from './handlers/delete_program';
import { getDepartments } from './handlers/get_departments';
import { createDepartment } from './handlers/create_department';
import { updateDepartment } from './handlers/update_department';
import { deleteDepartment } from './handlers/delete_department';
import { getSchoolEvents } from './handlers/get_school_events';
import { createSchoolEvent } from './handlers/create_school_event';
import { updateSchoolEvent } from './handlers/update_school_event';
import { deleteSchoolEvent } from './handlers/delete_school_event';
import { getAchievements } from './handlers/get_achievements';
import { createAchievement } from './handlers/create_achievement';
import { updateAchievement } from './handlers/update_achievement';
import { deleteAchievement } from './handlers/delete_achievement';
import { getNewsArticles } from './handlers/get_news_articles';
import { getPublishedNewsArticles } from './handlers/get_published_news_articles';
import { createNewsArticle } from './handlers/create_news_article';
import { updateNewsArticle } from './handlers/update_news_article';
import { deleteNewsArticle } from './handlers/delete_news_article';
import { getAlumni } from './handlers/get_alumni';
import { createAlumni } from './handlers/create_alumni';
import { updateAlumni } from './handlers/update_alumni';
import { deleteAlumni } from './handlers/delete_alumni';
import { getStudentRegistrations } from './handlers/get_student_registrations';
import { createStudentRegistration } from './handlers/create_student_registration';
import { updateStudentRegistrationStatus } from './handlers/update_student_registration_status';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Programs routes
  getPrograms: publicProcedure
    .query(() => getPrograms()),
  createProgram: publicProcedure
    .input(createProgramInputSchema)
    .mutation(({ input }) => createProgram(input)),
  updateProgram: publicProcedure
    .input(updateProgramInputSchema)
    .mutation(({ input }) => updateProgram(input)),
  deleteProgram: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteProgram(input)),

  // Departments routes
  getDepartments: publicProcedure
    .query(() => getDepartments()),
  createDepartment: publicProcedure
    .input(createDepartmentInputSchema)
    .mutation(({ input }) => createDepartment(input)),
  updateDepartment: publicProcedure
    .input(updateDepartmentInputSchema)
    .mutation(({ input }) => updateDepartment(input)),
  deleteDepartment: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteDepartment(input)),

  // School Events routes
  getSchoolEvents: publicProcedure
    .query(() => getSchoolEvents()),
  createSchoolEvent: publicProcedure
    .input(createSchoolEventInputSchema)
    .mutation(({ input }) => createSchoolEvent(input)),
  updateSchoolEvent: publicProcedure
    .input(updateSchoolEventInputSchema)
    .mutation(({ input }) => updateSchoolEvent(input)),
  deleteSchoolEvent: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteSchoolEvent(input)),

  // Achievements routes
  getAchievements: publicProcedure
    .query(() => getAchievements()),
  createAchievement: publicProcedure
    .input(createAchievementInputSchema)
    .mutation(({ input }) => createAchievement(input)),
  updateAchievement: publicProcedure
    .input(updateAchievementInputSchema)
    .mutation(({ input }) => updateAchievement(input)),
  deleteAchievement: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteAchievement(input)),

  // News Articles routes
  getNewsArticles: publicProcedure
    .query(() => getNewsArticles()),
  getPublishedNewsArticles: publicProcedure
    .query(() => getPublishedNewsArticles()),
  createNewsArticle: publicProcedure
    .input(createNewsArticleInputSchema)
    .mutation(({ input }) => createNewsArticle(input)),
  updateNewsArticle: publicProcedure
    .input(updateNewsArticleInputSchema)
    .mutation(({ input }) => updateNewsArticle(input)),
  deleteNewsArticle: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteNewsArticle(input)),

  // Alumni routes
  getAlumni: publicProcedure
    .query(() => getAlumni()),
  createAlumni: publicProcedure
    .input(createAlumniInputSchema)
    .mutation(({ input }) => createAlumni(input)),
  updateAlumni: publicProcedure
    .input(updateAlumniInputSchema)
    .mutation(({ input }) => updateAlumni(input)),
  deleteAlumni: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteAlumni(input)),

  // Student Registration routes
  getStudentRegistrations: publicProcedure
    .query(() => getStudentRegistrations()),
  createStudentRegistration: publicProcedure
    .input(createStudentRegistrationInputSchema)
    .mutation(({ input }) => createStudentRegistration(input)),
  updateStudentRegistrationStatus: publicProcedure
    .input(updateStudentRegistrationStatusInputSchema)
    .mutation(({ input }) => updateStudentRegistrationStatus(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
