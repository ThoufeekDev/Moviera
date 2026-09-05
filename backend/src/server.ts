import app from './app';
import { env } from './config/env';
import './shared/workers/otp.worker';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
