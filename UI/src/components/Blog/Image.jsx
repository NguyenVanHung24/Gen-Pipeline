import React from 'react';  
import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const REACT_APP_IK_URL_ENDPOINT = process.env.REACT_APP_IK_URL_ENDPOINT;
  return (
    <IKImage
      urlEndpoint={REACT_APP_IK_URL_ENDPOINT}
      path={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
