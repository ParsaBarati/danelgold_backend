import * as useragent from 'express-useragent';

export async function getUserOS(req: any) {
  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown';
  }

  const userAgent = useragent.parse(userAgentString);
  let deviceType;

  switch (true) {
    case userAgent.isMobile:
      deviceType = 'Mobile';
      break;
    case userAgent.isTablet:
      deviceType = 'Tablet';
      break;
    case userAgent.isChromeOS:
      deviceType = 'Chrome OS';
      break;
    case userAgent.isMac:
      deviceType = 'macOS';
      break;
    case userAgent.isDesktop:
      deviceType = 'Desktop';
      break;
    case userAgent.isiPad:
      deviceType = 'iPad';
      break;
    case userAgent.isLinux:
      deviceType = 'Linux';
      break;
    case userAgent.isSmartTV:
      deviceType = 'Smart TV';
      break;
    default:
      deviceType = 'Unknown';
      break;
  }

  return deviceType;
}

export async function getUserSource(req: any) {
  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown';
  }

  const userAgent = useragent.parse(userAgentString);
  return userAgent.source.toString();
}

export async function getDeviceVersion(req: any) {
  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown';
  }

  const userAgent = useragent.parse(userAgentString);
  return userAgent.version.toString();
}

export async function getBrowserVersion(req: any) {
  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown';
  }

  const userAgent = useragent.parse(userAgentString);
  return `${userAgent.browser}/${userAgent.version}`;
}

export async function getUserIP(req: any) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
}

export async function getUserBrowser(req: any) {
  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown';
  }

  const userAgent = useragent.parse(userAgentString);
  return userAgent.browser.toString();
}

export async function getVersionPlatform(req: any) {
  const platformVersion = req.headers['sec-ch-ua-platform-version'];
  const model = req.headers['sec-ch-ua-model'];

  if (platformVersion && model) {
    return `${model}; Android ${platformVersion}`;
  }

  const userAgentString = req.headers['user-agent'];
  if (!userAgentString) {
    console.error('No User-Agent header found');
    return 'Unknown Platform';
  }

  const match = userAgentString.match(/\(([^)]+)\)/);
  if (match) {
    const platformInfo = match[1];
    const platformParts = platformInfo.split(';');
    return platformParts.slice(0, 2).join(';');
  }
  return 'Unknown Platform';
}
