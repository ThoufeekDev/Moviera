import app from './app';
import { env } from './config/env';
// import './shared/workers/otp.worker';
import './modules/auth/infrastructure/jobs/worker'

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
