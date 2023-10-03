type EventName = keyof EventProperties;

type EventProperties = {
    'search': {
        search_term: string;
    },
    'pageview': {
        page: string;
    }
}

export function trackEvent(event: EventName, eventProperties: EventProperties[typeof event]) {
    const gtag = (window as any).gtag;
    console.log('debug::sending::', event, eventProperties);

    if (gtag) {
        gtag("event", event, eventProperties);
    } else {
        console.error('error::gtag is not defined');
    }
}