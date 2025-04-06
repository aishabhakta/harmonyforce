import React from "react";
import { Box, Typography } from "@mui/material";

const PrivacyPolicy: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "white", color: "black", px: { xs: 2, md: 6 }, py: 6, maxWidth: "1200px", mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Privacy Policy
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This privacy policy provides how Aardvark Games uses and protects any information that you give or share when you use this website.
        Aardvark Games is committed to ensuring that your privacy is protected. When we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
        <br /><br />
        Aardvark Games may change this policy from time to time by updating this page. You should check this page occasionally to ensure that you are happy with any changes.
        <br />
        <strong>This policy has been effective since 11.01.2022 and updated 01.01.2024.</strong>
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
        Information We May Collect
      </Typography>
      <ul>
        <li>Name</li>
        <li>Contact information including email address</li>
        <li>Demographic and personal information such as college enrollment and player bio</li>
        <li>Other information relevant to mailing list or popularity voting</li>
      </ul>

      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
        Why We Collect It
      </Typography>
      <ul>
        <li>To execute an international game tournament</li>
        <li>To improve our products and services</li>
        <li>To send promotional emails with updates, offers, or news</li>
        <li>To contact you for market research purposes</li>
        <li>To customize the website based on your interests</li>
        <li><strong>We will never sell your information</strong></li>
      </ul>

      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
        Security
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have implemented suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
        How We Use Cookies
      </Typography>
      <ul>
        <li>Cookies help us analyze web traffic and respond to you as an individual</li>
        <li>We use traffic log cookies to identify which pages are used and improve our site</li>
        <li>Cookies help provide a better experience without accessing data you don’t choose to share</li>
      </ul>

      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
        Links to Other Websites
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Our website may contain links to other sites of interest. However, once you leave our site, we are not responsible for the protection and privacy of any information you provide on those external sites. Please refer to their privacy policies.
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: "bold", mt: 4, mb: 1 }}>
        Controlling Your Personal Information
      </Typography>
      <ul>
        <li>You may restrict the collection or use of your information at any time</li>
        <li>You may opt out of marketing emails by contacting us</li>
        <li>We do not sell or lease your data without permission or legal obligation</li>
        <li>You may request a copy of the data we hold under the Data Protection Act 1998 (a small fee may apply)</li>
        <li>If your information is incorrect, contact us through our form and we will promptly correct it</li>
      </ul>

      <Typography variant="body1" sx={{ mt: 4 }}>
        We respect your right to privacy and sincerely work to protect your information.
      </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
