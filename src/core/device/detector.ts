export function DeviceDetector({ mobile, tablet, desktop }: DeviceDetectorOptions) {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const tabletRegex =
        /(iPad|Tablet|(Android(?!.*Mobile))|SM-T\d{3}|Kindle|Surface|PlayBook|Nexus (7|10)|Tab)/i;
    const desktopRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Kindle|Surface|PlayBook|Nexus (7|10)|Tab/i;

    const mobileMM = window.matchMedia(`(max-width: ${mobile?.max || 479}px)`);
    const tabletMM = window.matchMedia(
        `(min-width: ${tablet?.min || 768}px) and (max-width: ${tablet?.max || 991}px)`
    );
    const desktopMM = window.matchMedia(`(min-width: ${desktop?.min || 1025}px)`);

    return {
        isMobile(): boolean {
            return mobileRegex.test(navigator.userAgent) || mobileMM.matches;
        },

        isTablet(): boolean {
            return tabletRegex.test(navigator.userAgent) || tabletMM.matches;
        },

        isDesktop(): boolean {
            return !desktopRegex.test(navigator.userAgent) && desktopMM.matches;
        }
    };
}

export interface DeviceDetectorOptions {
    mobile?: { min?: number; max?: number };
    tablet?: { min?: number; max?: number };
    desktop?: { min?: number; max?: number };
}
