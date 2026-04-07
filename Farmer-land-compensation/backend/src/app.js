const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');
const auth = require('./middleware/auth');
const casesRoutes = require('./modules/cases/cases.routes');
const landDetailsRoutes = require('./modules/landDetails/landDetails.routes');
const compensationRoutes = require('./modules/compensation/compensation.routes');
const workflowRoutes = require('./modules/workflow/workflow.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '1mb' }));

app.use('/auth', authRoutes);
app.use('/cases', auth, casesRoutes);
app.use('/cases', auth, landDetailsRoutes);
app.use('/cases', auth, workflowRoutes);
app.use(auth, compensationRoutes);

app.use(errorHandler);

module.exports = app;
