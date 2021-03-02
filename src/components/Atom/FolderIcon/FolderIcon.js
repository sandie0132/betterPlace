import React from 'react';

const folderIcon = (props) => {

    return(
        <svg width="24" height="21" viewBox="0 0 24 21" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <path d="M12,6.32 L22,6.32 C23.1045695,6.32 24,7.2154305 24,8.32 L24,20.4 C24,21.5045695 23.1045695,22.4 22,22.4 L2,22.4 C0.8954305,22.4 1.3527075e-16,21.5045695 0,20.4 L0,8.72 L0,4 C-1.3527075e-16,2.8954305 0.8954305,2 2,2 L10,2 C11.1045695,2 12,2.8954305 12,4 L12,6.32 Z"
                id="path-1" />
            </defs>
            <g id="🏂-on-boarding" fill="none" fillRule="evenodd">
                <g id="03-BGV-Client-onboarding_fun&amp;role_E3" transform="translate(-392 -295)">
                    <g id="text-input-/-small-/--add-fun-role" transform="translate(384 285)">
                        <g id="Group-2" transform="translate(8 8)">
                            <g id="icon-/-24-/-info-/-folder">
                                <rect id="Rectangle" width="24" height="24" />
                                <rect id="Rectangle-6" fill="#000" opacity="0.6" style={{ mixBlendMode:
                                'multiply' }} x="1.44" y="4.4" width="19.92" height="10.56" rx="1" />
                                <mask id="mask-2" fill="#fff">
                                    <use xlinkHref="#path-1" />
                                </mask>
                                <use id="Combined-Shape" fill="#6A54CD" xlinkHref="#path-1" />
                                <rect id="Rectangle" fill={props.color} mask="url(#mask-2)" width="24" height="24"
                                />
                                <path d="M15.16,19.0265 C14.3415,18.75 13.921,18.1465 13.7075,17.66 C14.8865,16.953 15.5,15.275 15.5,14 C15.5,12.343 14.157,11 12.5,11 C10.843,11 9.5,12.343 9.5,14 C9.5,15.276 10.114,16.955 11.2945,17.661 C11.082,18.1515 10.6625,18.7595 9.846,19.0245 C8.406,19.491 7,19.6435 7,22 L7,23 L18,23 L18,22 C18,19.6785 16.6565,19.532 15.16,19.0265 Z"
                                id="Path" fill="#000" opacity="0.2" mask="url(#mask-2)" />
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
}
export default folderIcon;