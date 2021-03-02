import React from 'react';
import ContentLoader from 'react-content-loader';
import themes from '../../../theme.scss';

const TagLoader = () => {
  const primaryColor = themes.loaderPrimary;
  const secondaryColor = themes.loaderSecondary;

  return (
    <>
      <div>
        <svg width="100%" height="100%">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="65" y="15" rx="5" ry="100" width="35%" height="20%" />
            <rect x="55" y="155" rx="4" ry="100" width="45%" height="14%" />
            <rect x="40" y="250" rx="4" ry="100" width="60%" height="10%" />
            <rect x="0" y="320" rx="0" ry="100%" width="100%" height="35%" />
          </ContentLoader>
        </svg>
      </div>

      <div className="mt-5">
        <svg width="100%" height="100%">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="0" y="0" rx="5" ry="100" width="24%" height="22%" />
            <rect x="65" y="0" rx="5" ry="100" width="26%" height="22%" />
            <rect x="150" y="0" rx="5" ry="100" width="24%" height="22%" />

            <rect x="0" y="180" rx="4" ry="100" width="24%" height="15%" />
            <rect x="65" y="180" rx="4" ry="100" width="35%" height="15%" />
            <rect x="150" y="180" rx="4" ry="100" width="24%" height="15%" />

            <rect x="0" y="330" rx="4" ry="100" width="24%" height="15%" />
            <rect x="65" y="330" rx="4" ry="100" width="35%" height="15%" />
            <rect x="150" y="330" rx="4" ry="100" width="24%" height="15%" />

          </ContentLoader>
        </svg>
      </div>

      <div>
        <svg width="100%" height="100%">
          <ContentLoader
            height={500}
            width={200}
            speed={1}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          >
            <rect x="0" y="0" rx="5" ry="100" width="12%" height="15%" />

            <rect x="0" y="120" rx="4" ry="100" width="24%" height="15%" />
            <rect x="65" y="120" rx="4" ry="100" width="35%" height="15%" />
            <rect x="150" y="120" rx="4" ry="100" width="24%" height="15%" />

            <rect x="0" y="330" rx="4" ry="100" width="59%" height="15%" />

          </ContentLoader>
        </svg>
      </div>

    </>
  );
};

export default TagLoader;
