export function DeviceDetector({ mobile, tablet, desktop }: DeviceDetectorOptions) {
    return {
        isMobile(): boolean {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) || window.matchMedia(`(max-width: ${mobile?.max || 479}px)`).matches
            );
        },

        isTablet(): boolean {
            return (
                /(iPad|Tablet|(Android(?!.*Mobile))|SM-T\d{3}|Kindle|Surface|PlayBook|Nexus (7|10)|Tab)/i.test(
                    navigator.userAgent
                ) ||
                window.matchMedia(
                    `(min-width: ${tablet?.min || 768}px) and (max-width: ${tablet?.max || 991}px)`
                ).matches
            );
        },

        isDesktop(): boolean {
            return (
                !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet|Kindle|Surface|PlayBook|Nexus (7|10)|Tab/i.test(
                    navigator.userAgent
                ) && window.matchMedia(`(min-width: ${desktop?.min || 1025}px)`).matches
            );
        }
    };
}

export interface DeviceDetectorOptions {
    mobile?: { min?: number; max?: number };
    tablet?: { min?: number; max?: number };
    desktop?: { min?: number; max?: number };
}
