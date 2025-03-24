import React from "react";
 import {
   Box,
   Typography,
   Accordion,
   AccordionSummary,
   AccordionDetails,
//    TextField,
//    Button,
   Container,
 } from "@mui/material";
 import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


 const faqs = [
   { question: "Can I buy the game now?", answer: "You can sign up for our pre-order list on the Game page." },
   { question: "I don't see my university listed. Can I still play?", answer: "Please contact support for more information about adding your university." },
   { question: "Do I get my money back if my college doesn't have playoff rounds?", answer: "Refund policies vary. Please review our terms and conditions for details." },
   { question: "What if our team can't afford to travel to the final playoff location?", answer: "We offer travel assistance programs. Contact us for more details." },
   { question: "I'm taking a break from college, can I play?", answer: "Eligibility depends on the tournament rules. Check with your university's admin for details." }
 ];

 const FaqPage: React.FC = () => {
   return (
     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

       {/* FAQ Section */}
       <Container maxWidth="md" sx={{ flexGrow: 1, textAlign: "center", my: 6 }}>
         <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
           Frequently Asked Questions
         </Typography>
         <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
           Find answers to commonly asked questions here.
         </Typography>

         {faqs.map((faq, index) => (
           <Accordion key={index} sx={{ boxShadow: 2, mb: 2 }}>
             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
               <Typography variant="h6" sx={{ fontWeight: "bold" }}>{faq.question}</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <Typography>{faq.answer}</Typography>
             </AccordionDetails>
           </Accordion>
         ))}
       </Container>

       {/* Contact Us Section */}
       <Container maxWidth="md" sx={{ textAlign: "center", mb: 8 }}>
         <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
           Contact Us
         </Typography>
         <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
         Couldn’t find the answer to your question? Reach out to us at Aardvark@gmail.com or call us at 7475550123
         </Typography>

       </Container>

     </Box>
   );
 };

 export default FaqPage;