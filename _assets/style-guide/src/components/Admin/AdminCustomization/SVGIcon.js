/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const V4LandscapeSplashScreen = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <path d="M0,0H274V274H0ZM260,34H12A12,12,0,0,0,0,46V230a12,12,0,0,0,12,12H260a12,12,0,0,0,12-12V46A12,12,0,0,0,260,34Z" fill="#fff" />
    <path id="a" d="M260,34a12,12,0,0,1,12,12V230a12,12,0,0,1-12,12H12A12,12,0,0,1,0,230V46A12,12,0,0,1,12,34ZM250,44H22V232H250Z" fill="#fff" />
    <path
      d="M260,35H12A11,11,0,0,0,1,46V230a11,11,0,0,0,11,11H260a11,11,0,0,0,11-11V46A11,11,0,0,0,260,35Zm-9,8V233H21V43Z" fill="none" stroke="#888"
      strokeWidth="2"
    />
    <circle
      cx="10" cy="138" r="5"
      fill="none" stroke="#979797" strokeWidth="2"
    />
    <circle
      cx="260" cy="138" r="2"
      fill="#888"
    />
  </svg>
);

const V4LoginPageLogo = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm94 72v16h84V72H94z" />
      <path fill="#DDD" d="M0 258h274v16H0z" />
      <path fill="#AAA" d="M6 264h20v4H6zM34 264h20v4H34zM62 264h20v4H62zM90 264h20v4H90z" />
      <rect
        width="8" height="8" x="222"
        y="262" fill="#AAA" rx="2"
      />
      <rect
        width="8" height="8" x="234"
        y="262" fill="#AAA" rx="2"
      />
      <rect
        width="8" height="8" x="246"
        y="262" fill="#AAA" rx="2"
      />
      <rect
        width="8" height="8" x="258"
        y="262" fill="#AAA" rx="2"
      />
      <path fill="#DDD" d="M72 56h128v140H72V56zm22 16v16h84V72H94z" />
      <path fill="#888" d="M86 104h100v2H86z" />
      <path fill="#AAA" d="M86 114h100v12H86zM86 130h100v12H86z" />
      <path fill="#888" d="M86 164h100v12H86z" />
      <rect
        width="6" height="6" x="86"
        y="150" fill="#888" rx="2"
      />
      <path fill="#888" d="M96 152h20v2H96z" />
    </g>
  </svg>
);

const V4MainCompanyLogo = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm4 4v12h56V4H4z" />
      <path fill="#DDD" d="M0 20h274v2H0zM16 22h2v252h-2z" />
      <path fill="#888" d="M4 28h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8zm0 16h8v8H4v-8z" />
      <circle
        cx="200" cy="10" r="4"
        fill="#888"
      />
      <circle
        cx="212" cy="10" r="4"
        fill="#888"
      />
      <circle
        cx="224" cy="10" r="4"
        fill="#888"
      />
      <circle
        cx="236" cy="10" r="4"
        fill="#888"
      />
      <circle
        cx="260" cy="10" r="6"
        fill="#888"
      />
      <path fill="#DDD" d="M246 4h2v12h-2zM218 22h56v252h-56z" />
      <path fill="#AAA" d="M226 28h28v4h-28zM226 36h36v4h-36zM226 44h24v4h-24zM226 60h36v4h-36zM226 68h28v4h-28zM226 76h36v4h-36z" />
      <circle
        cx="233" cy="99" r="7"
        fill="#888"
      />
      <circle
        cx="233" cy="121" r="7"
        fill="#888"
      />
      <path fill="#888" d="M244 98h20v2h-20zM244 120h20v2h-20z" />
      <circle
        cx="233" cy="143" r="7"
        fill="#888"
      />
      <path fill="#888" d="M244 142h20v2h-20z" />
      <circle
        cx="233" cy="165" r="7"
        fill="#888"
      />
      <path fill="#888" d="M244 164h20v2h-20z" />
      <path fill="#DDD" d="M26 28h16v4H26zM50 28h16v4H50zM74 28h16v4H74zM98 28h16v4H98zM26 38h184v2H26z" />
      <path fill="#888" d="M26 46h40v40H26V46zm0 44h28v2H26v-2zm0 4h36v2H26v-2zm0 4h20v2H26v-2zM26 108h40v40H26v-40zm0 44h28v2H26v-2zm0 4h36v2H26v-2zm0 4h20v2H26v-2zM26 170h40v40H26v-40zm0 44h28v2H26v-2zm0 4h36v2H26v-2zm0 4h20v2H26v-2zM26 232h40v40H26zM74 232h40v40H74zM74 46h40v40H74V46zm0 44h28v2H74v-2zm0 4h36v2H74v-2zm0 4h20v2H74v-2zM74 108h40v40H74v-40zm0 44h28v2H74v-2zm0 4h36v2H74v-2zm0 4h20v2H74v-2zM74 170h40v40H74v-40zm0 44h28v2H74v-2zm0 4h36v2H74v-2zm0 4h20v2H74v-2zM122 46h40v40h-40V46zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2zM122 108h40v40h-40v-40zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2zM122 170h40v40h-40v-40zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2zM170 46h40v40h-40V46zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2zM170 108h40v40h-40v-40zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2zM170 170h40v40h-40v-40zm0 44h28v2h-28v-2zm0 4h36v2h-36v-2zm0 4h20v2h-20v-2z" />
    </g>
  </svg>
);

const V4PortraitSplashScreen = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <path d="M0,0H274V274H0ZM32,14V262a12,12,0,0,0,12,12H228a12,12,0,0,0,12-12V14A12,12,0,0,0,228,2H44A12,12,0,0,0,32,14Z" fill="#fff" />
    <path id="a" d="M32,14A12,12,0,0,1,44,2H228a12,12,0,0,1,12,12V262a12,12,0,0,1-12,12H44a12,12,0,0,1-12-12ZM42,24V252H230V24Z" fill="#fff" />
    <path
      d="M33,14V262a11,11,0,0,0,11,11H228a11,11,0,0,0,11-11V14A11,11,0,0,0,228,3H44A11,11,0,0,0,33,14Zm8,9H231V253H41Z" fill="none" stroke="#888"
      strokeWidth="2"
    />
    <circle
      cx="136" cy="264" r="5"
      fill="none" stroke="#979797" strokeWidth="2"
    />
    <circle
      cx="136" cy="14" r="2"
      fill="#888"
    />
  </svg>
);

const V5LoginPageLogo = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm177 83v12h48V83h-48z" />
      <path fill="#AAA" d="M155 264h20v4h-20zM127 264h20v4h-20zM99 264h20v4H99z" />
      <path fill="#DDD" d="M137 73h128v128H137V73zm40 10v12h48V83h-48z" />
      <path fill="#888" d="M160 171h80v12h-80z" />
      <path fill="#AAA" d="M160 147h80v12h-80zM160 131h80v12h-80zM160 115h80v12h-80z" />
      <path fill="#888" d="M173 105h56v2h-56zM169 99h64v2h-64zM9 73h128v128H9z" />
    </g>
  </svg>
);

const V5LoginPageWallpaper = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm9 73v128h128V73H9z" />
      <path fill="#AAA" d="M155 264h20v4h-20zM127 264h20v4h-20zM99 264h20v4H99z" />
      <path fill="#DDD" d="M137 73h128v128H137z" />
      <path fill="#888" d="M160 171h80v12h-80z" />
      <path fill="#AAA" d="M160 147h80v12h-80zM160 131h80v12h-80zM160 115h80v12h-80z" />
      <path fill="#888" d="M173 105h56v2h-56zM169 99h64v2h-64z" />
      <path fill="#AAA" d="M177 83h48v12h-48z" />
    </g>
  </svg>
);

const V5UserSelfEnrollmentWallpaper = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm9 73v128h128V73H9z" />
      <path fill="#AAA" d="M155 264h20v4h-20zM127 264h20v4h-20zM99 264h20v4H99z" />
      <path fill="#DDD" d="M137 73h128v128H137z" />
      <path fill="#888" d="M160 171h80v12h-80z" />
      <path fill="#AAA" d="M160 147h80v12h-80zM160 131h80v12h-80zM160 115h80v12h-80z" />
      <path fill="#888" d="M173 105h56v2h-56zM169 99h64v2h-64z" />
      <path fill="#AAA" d="M177 83h48v12h-48z" />
    </g>
  </svg>
);

const V5WebMainCompanyLogo = (props) => (
  <svg
    width="274" height="274" viewBox="0 0 274 274"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#EEE" d="M0 0h274v274H0V0zm0 0v16h16V0H0z" />
      <path fill="#DDD" d="M0 0h16v274H0V0zm0 0h16v16H0V0z" />
      <path fill="#888" d="M4 25.998C4 24.895 4.887 24 5.998 24h4.004c1.103 0 1.998.887 1.998 1.998v4.004A1.993 1.993 0 0 1 10.002 32H5.998A1.993 1.993 0 0 1 4 30.002v-4.004zm0 16C4 40.895 4.887 40 5.998 40h4.004c1.103 0 1.998.887 1.998 1.998v4.004A1.993 1.993 0 0 1 10.002 48H5.998A1.993 1.993 0 0 1 4 46.002v-4.004zm0 16C4 56.895 4.887 56 5.998 56h4.004c1.103 0 1.998.887 1.998 1.998v4.004A1.993 1.993 0 0 1 10.002 64H5.998A1.993 1.993 0 0 1 4 62.002v-4.004zm0 16C4 72.895 4.887 72 5.998 72h4.004c1.103 0 1.998.887 1.998 1.998v4.004A1.993 1.993 0 0 1 10.002 80H5.998A1.993 1.993 0 0 1 4 78.002v-4.004zm0 16C4 88.895 4.887 88 5.998 88h4.004c1.103 0 1.998.887 1.998 1.998v4.004A1.993 1.993 0 0 1 10.002 96H5.998A1.993 1.993 0 0 1 4 94.002v-4.004zM226 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      <circle
        cx="242" cy="12" r="4"
        fill="#888"
      />
      <circle
        cx="260" cy="12" r="6"
        fill="#888"
      />
      <path fill="#888" d="M30 262h40v12H30zM78 262h40v12H78zM126 262h40v12h-40zM172 262h40v12h-40zM220 262h40v12h-40zM30 110h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM30 134h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM30 158h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM30 182h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM30 206h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM30 230h16v16H30v-16zm20 4h44v2H50v-2zm0 6h24v2H50v-2zM114 110h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM114 134h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM114 158h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM114 182h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM114 206h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM114 230h16v16h-16v-16zm20 4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 118c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 142c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 166c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 190c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 214c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM196 238c0-4.418 3.59-8 8-8 4.418 0 8 3.59 8 8 0 4.418-3.59 8-8 8-4.418 0-8-3.59-8-8zm20-4h44v2h-44v-2zm0 6h24v2h-24v-2zM16 24h68v72H16zM208 24h66v72h-66zM86 24h120v72H86z" />
    </g>
  </svg>
);

const DefaultBackground = (props) => (
  <svg
    width="2048px" height="2048px" viewBox="0 0 2048 2048"
    version="1.1" className={props.className} style={props.style}
  >
    <g id="Generic-" transform="translate(697.692338, 1142.375199) scale(-1, 1) rotate(-210.000000) translate(-697.692338, -1142.375199) translate(-1209.807662, -804.124801)">
      <rect
        fillOpacity="0.1" x="1741.26545" y="276.48"
        width="819.2" height="3481.6"
      />
      <rect
        fillOpacity="0.1" x="1741.26545" y="1095.68"
        width="2073.6" height="819.2"
      />
      <rect
        fillOpacity="0.05" x="1741.04992" y="3073.77927"
        width="1740.8" height="819.2"
      />
      <rect
        fillOpacity="0.1" x="0.280369026" y="1096.00058"
        width="1740.8" height="819.2"
      />
      <rect
        fillOpacity="0.15" x="922.065455" y="276.48"
        width="819.2" height="3481.6"
      />
      <rect
        fillOpacity="0.1" transform="translate(1556.945455, 1520.640000) rotate(-315.000000) translate(-1556.945455, -1520.640000) " x="1147.34545"
        y="-220.16" width="819.2" height="3481.6"
      />
      <rect
        fillOpacity="0.119999997" transform="translate(2167.031645, 2068.945455) rotate(-315.000000) translate(-2167.031645, -2068.945455) " x="1757.43165"
        y="328.145455" width="819.2" height="3481.6"
      />
    </g>
  </svg>
);

const DeviceAppIcon = (props) => (
  <svg
    id="svg" version="1.1" width="512"
    height="512" viewBox="0 0 400 400" className={props.className}
    style={props.style}
  >
    <g id="svgg">
      <path
        id="path0" d="M204.297 87.160 C 80.586 106.007,44.595 267.574,148.828 336.161 C 239.506 395.829,359.845 330.843,359.737 222.266 C 359.653 138.842,285.891 74.729,204.297 87.160 M247.497 123.746 C 330.770 144.747,352.948 251.548,284.766 303.220 C 218.596 353.366,122.632 305.497,122.659 222.359 C 122.681 156.893,184.694 107.908,247.497 123.746 " stroke="none"
        fill="#ffffff" fillRule="evenodd"
      />
      <path
        id="path1" d="" stroke="none"
        fill="#b62424" fillRule="evenodd"
      />
      <path
        id="path2" d="M86.328 0.860 C 34.094 5.921,5.689 34.823,0.794 87.891 C -0.309 99.845,-0.276 301.577,0.830 312.950 C 5.564 361.605,30.199 389.610,75.458 397.787 L 85.547 399.609 200.000 399.609 L 314.453 399.609 324.542 397.787 C 369.951 389.583,394.722 361.276,399.174 312.500 C 400.303 300.136,400.299 98.656,399.170 87.050 C 394.473 38.778,369.956 10.733,325.000 2.205 C 315.314 0.368,103.716 -0.825,86.328 0.860 M194.388 42.578 C 221.215 47.747,245.607 63.133,262.510 85.547 C 267.458 92.108,268.144 92.703,272.773 94.452 C 356.991 126.261,387.440 230.926,333.708 303.906 C 288.627 365.137,197.281 377.401,139.402 329.993 C 137.375 328.333,133.560 326.533,128.855 325.017 C 45.332 298.107,12.023 196.272,63.432 125.000 C 66.066 121.348,69.197 115.846,70.389 112.774 C 90.116 61.949,142.124 32.507,194.388 42.578 M160.215 48.504 C 131.472 52.225,104.024 69.414,87.960 93.750 C 81.013 104.276,81.053 104.751,88.406 99.046 C 127.292 68.877,181.864 62.510,223.535 83.282 C 226.065 84.543,229.681 85.341,235.599 85.943 C 240.247 86.416,246.683 87.306,249.900 87.922 C 257.181 89.315,257.069 89.600,251.739 83.247 C 230.421 57.839,194.230 44.101,160.215 48.504 M153.906 93.481 C 119.254 98.800,87.899 120.660,73.157 149.779 C 68.706 158.570,72.876 180.150,82.598 198.642 C 87.204 207.402,87.912 207.728,88.626 201.419 C 93.735 156.261,128.090 113.877,175.781 93.893 C 177.706 93.086,158.798 92.731,153.906 93.481 M215.234 121.586 C 158.755 127.691,117.942 176.265,123.309 230.990 C 124.400 242.110,124.110 241.623,131.503 244.776 C 188.841 269.234,252.072 241.378,271.585 183.063 L 274.330 174.860 272.296 168.485 C 265.454 147.047,249.504 124.328,240.152 122.699 C 234.590 121.731,219.949 121.077,215.234 121.586 M285.156 142.440 C 285.156 142.651,286.188 145.122,287.449 147.932 C 316.861 213.486,287.606 289.904,221.552 320.065 C 214.697 323.195,216.344 323.928,228.405 323.115 C 308.246 317.736,351.369 230.940,306.924 165.076 C 301.739 157.392,285.156 140.148,285.156 142.440 M63.754 173.447 C 52.859 211.061,66.468 255.686,97.047 282.621 C 103.903 288.660,103.930 288.628,99.654 279.600 C 91.904 263.239,86.719 240.351,86.719 222.499 C 86.719 219.092,86.188 217.798,82.507 212.230 C 74.839 200.633,70.534 190.948,67.178 177.744 L 64.995 169.160 63.754 173.447 M273.047 198.299 C 249.359 249.023,188.063 273.842,135.567 253.964 C 126.269 250.444,126.781 250.254,128.843 256.450 C 134.697 274.041,150.659 294.734,166.566 305.356 C 173.453 309.954,174.642 310.124,186.525 308.196 C 237.542 299.922,274.953 256.813,277.100 203.825 C 277.653 190.185,277.154 189.504,273.047 198.299 M43.750 316.824 L 43.750 328.179 46.128 325.471 C 52.955 317.695,64.305 317.654,68.306 325.391 C 69.732 328.148,69.952 330.193,70.179 342.773 L 70.437 357.031 68.031 357.031 L 65.625 357.031 65.621 345.508 C 65.616 332.880,64.887 328.878,62.081 326.072 C 58.667 322.658,52.003 323.837,47.556 328.641 C 44.031 332.450,43.750 333.707,43.750 345.652 L 43.750 357.031 41.406 357.031 L 39.063 357.031 39.063 331.250 L 39.063 305.469 41.406 305.469 L 43.750 305.469 43.750 316.824 " stroke="none"
        fill="#e0693a" fillRule="evenodd"
      />
      <path
        id="path3" d="" stroke="none"
        fill="#ff0000" fillRule="evenodd"
      />
      <path
        id="path4" d="" stroke="none"
        fill="#ff3333" fillRule="evenodd"
      />
      <path
        id="path5" d="" stroke="none"
        fill="#ff5500" fillRule="evenodd"
      />
      <path
        id="path6" d="M160.157 41.450 C 119.876 46.496,85.519 73.794,70.389 112.774 C 69.197 115.846,66.066 121.348,63.432 125.000 C 13.399 194.364,42.949 292.383,123.100 322.922 C 135.680 327.715,135.743 327.657,127.282 318.992 C 116.505 307.955,103.906 291.074,103.906 287.672 C 103.906 287.097,103.601 286.815,103.227 287.046 C 102.303 287.617,92.505 278.889,87.074 272.656 C 63.568 245.682,54.278 206.161,63.754 173.447 L 64.995 169.160 67.178 177.744 C 69.603 187.286,71.271 191.801,75.463 200.181 C 78.384 206.019,86.025 218.141,86.491 217.676 C 87.791 216.376,87.887 206.637,86.612 205.362 C 76.944 195.694,68.200 159.570,73.157 149.779 C 90.088 116.336,126.136 94.111,164.844 93.252 C 174.085 93.046,179.655 92.572,182.031 91.789 C 190.197 89.098,203.520 86.640,214.665 85.770 C 228.191 84.714,228.161 84.844,216.016 80.124 C 172.900 63.369,125.291 70.429,88.406 99.046 C 81.053 104.751,81.013 104.276,87.960 93.750 C 118.143 48.022,179.331 34.177,226.798 62.335 C 237.160 68.482,251.097 80.973,255.530 88.086 C 256.133 89.053,257.332 89.855,258.196 89.869 C 259.059 89.883,261.564 90.516,263.763 91.276 L 267.760 92.658 263.812 87.149 C 240.491 54.615,199.463 36.526,160.157 41.450 M248.003 126.786 C 258.996 139.502,268.019 154.983,272.306 168.485 L 274.330 174.860 271.585 183.063 C 252.022 241.527,187.169 269.796,130.716 244.467 C 127.878 243.194,125.427 242.281,125.269 242.439 C 124.531 243.177,127.093 251.196,128.138 251.420 C 128.775 251.557,132.476 252.854,136.362 254.302 C 187.697 273.439,246.747 250.017,271.893 200.544 C 277.455 189.602,277.750 189.830,277.096 204.569 C 274.590 261.079,232.067 305.173,175.848 309.558 C 168.970 310.094,192.692 319.131,208.325 321.930 C 213.284 322.818,217.541 323.344,217.785 323.100 C 218.029 322.856,217.731 322.650,217.122 322.642 C 216.514 322.634,218.487 321.491,221.507 320.103 C 288.053 289.507,316.547 214.712,287.274 147.469 C 283.447 138.677,269.828 130.331,250.629 125.010 L 245.157 123.494 248.003 126.786 M151.924 150.977 L 148.047 155.078 152.148 151.201 C 155.960 147.599,156.608 146.875,156.025 146.875 C 155.902 146.875,154.056 148.721,151.924 150.977 M294.922 150.781 C 297.038 152.930,298.945 154.688,299.160 154.688 C 299.375 154.688,297.819 152.930,295.703 150.781 C 293.587 148.633,291.680 146.875,291.465 146.875 C 291.250 146.875,292.806 148.633,294.922 150.781 M360.448 222.266 C 360.450 226.992,360.579 228.825,360.734 226.339 C 360.890 223.852,360.889 219.985,360.731 217.745 C 360.574 215.505,360.447 217.539,360.448 222.266 M86.981 224.219 C 86.981 227.441,87.119 228.760,87.288 227.148 C 87.456 225.537,87.456 222.900,87.288 221.289 C 87.119 219.678,86.981 220.996,86.981 224.219 M151.953 293.750 C 154.069 295.898,155.976 297.656,156.191 297.656 C 156.406 297.656,154.851 295.898,152.734 293.750 C 150.618 291.602,148.711 289.844,148.496 289.844 C 148.281 289.844,149.837 291.602,151.953 293.750 M294.885 293.945 L 291.797 297.266 295.117 294.177 C 298.205 291.305,298.797 290.625,298.205 290.625 C 298.078 290.625,296.584 292.119,294.885 293.945 M39.063 331.250 L 39.063 357.031 41.406 357.031 L 43.750 357.031 43.750 345.652 C 43.750 333.707,44.031 332.450,47.556 328.641 C 52.003 323.837,58.667 322.658,62.081 326.072 C 64.887 328.878,65.616 332.880,65.621 345.508 L 65.625 357.031 68.031 357.031 L 70.437 357.031 70.179 342.773 C 69.952 330.193,69.732 328.148,68.306 325.391 C 64.305 317.654,52.955 317.695,46.128 325.471 L 43.750 328.179 43.750 316.824 L 43.750 305.469 41.406 305.469 L 39.063 305.469 39.063 331.250 M219.755 359.172 C 222.241 359.327,226.109 359.326,228.349 359.169 C 230.589 359.011,228.555 358.884,223.828 358.886 C 219.102 358.888,217.269 359.016,219.755 359.172 " stroke="none"
        fill="#eeb596" fillRule="evenodd"
      />
      <path
        id="path7" d="" stroke="none"
        fill="#ffb624" fillRule="evenodd"
      />
      <path
        id="path8" d="M219.357 85.729 C 221.194 85.894,224.007 85.892,225.607 85.724 C 227.207 85.556,225.703 85.421,222.266 85.424 C 218.828 85.427,217.519 85.564,219.357 85.729 M130.029 122.852 L 127.734 125.391 130.273 123.096 C 132.640 120.957,133.172 120.313,132.568 120.313 C 132.434 120.313,131.291 121.455,130.029 122.852 M314.844 120.557 C 314.844 120.691,315.986 121.834,317.383 123.096 L 319.922 125.391 317.627 122.852 C 315.488 120.485,314.844 119.953,314.844 120.557 M124.560 128.320 L 122.266 130.859 124.805 128.565 C 127.171 126.426,127.703 125.781,127.099 125.781 C 126.965 125.781,125.822 126.924,124.560 128.320 M320.313 126.026 C 320.313 126.160,321.455 127.303,322.852 128.565 L 325.391 130.859 323.096 128.320 C 320.957 125.954,320.313 125.422,320.313 126.026 M322.998 315.820 L 320.703 318.359 323.242 316.065 C 325.609 313.926,326.140 313.281,325.537 313.281 C 325.402 313.281,324.260 314.424,322.998 315.820 " stroke="none"
        fill="#f5d7c6" fillRule="evenodd"
      />
      <path
        id="path9" d="" stroke="none"
        fill="#ffff00" fillRule="evenodd"
      />
    </g>
  </svg>
);

export default class SVGIcon extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      'v4LandscapeSplashScreen',
      'v4LoginPageLogo',
      'v4MainCompanyLogo',
      'v4PortraitSplashScreen',
      'v5LoginPageLogo',
      'v5LoginPageWallpaper',
      'v5UserSelfEnrollmentWallpaper',
      'v5WebMainCompanyLogo',
      'defaultBackground',
      'deviceAppIcon'
    ]),
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const styles = require('./SVGIcon.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FolderSVG: this.props.type === 'folder'
    }, this.props.className);

    let Comp;
    switch (this.props.type) {
      case 'v4LandscapeSplashScreen':
        Comp = V4LandscapeSplashScreen;
        break;
      case 'v4LoginPageLogo':
        Comp = V4LoginPageLogo;
        break;
      case 'v4MainCompanyLogo':
        Comp = V4MainCompanyLogo;
        break;
      case 'v4PortraitSplashScreen':
        Comp = V4PortraitSplashScreen;
        break;
      case 'v5LoginPageLogo':
        Comp = V5LoginPageLogo;
        break;
      case 'v5LoginPageWallpaper':
        Comp = V5LoginPageWallpaper;
        break;
      case 'v5UserSelfEnrollmentWallpaper':
        Comp = V5UserSelfEnrollmentWallpaper;
        break;
      case 'v5WebMainCompanyLogo':
        Comp = V5WebMainCompanyLogo;
        break;
      case 'defaultBackground':
        Comp = DefaultBackground;
        break;
      case 'deviceAppIcon':
        Comp = DeviceAppIcon;
        break;
      default:
        return false;
    }

    return <Comp {...this.props} className={classes} />;
  }
}
