'use client';

import { useEffect, useState } from 'react';
import ENV from '@/utils/env.utils';
import {
  loadRecaptchaScript,
  registerRecaptchaCallback,
  unregisterRecaptchaCallback,
} from '@/utils/recaptcha.utils';

interface ReCaptchaV3Props {
  onToken: (token: string) => void;
}

export default function ReCaptchaV3({ onToken }: ReCaptchaV3Props) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    registerRecaptchaCallback(onToken);

    loadRecaptchaScript()
      .then(() => setScriptLoaded(true))
      .catch(() => {
        setScriptLoaded(false);
      });

    return () => {
      unregisterRecaptchaCallback();
    };
  }, [onToken]);

  return (
    <div className="flex justify-center mt-4">
      {scriptLoaded && (
        <div
          className="g-recaptcha"
          data-sitekey={ENV.RECAPTCHA_SITE_KEY}
          data-callback="handleCaptchaChange"
        />
      )}
    </div>
  );
}
