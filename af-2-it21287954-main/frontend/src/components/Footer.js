// frontend/src/components/Footer.js
import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark, // Using a darker shade of primary
  color: theme.palette.primary.contrastText, // White text color
  padding: theme.spacing(3, 0), // py-6 equivalent
}));

const FooterContent = styled(Box)({
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: theme => theme.spacing(2), // px-4 equivalent
  paddingRight: theme => theme.spacing(2), // px-4 equivalent
  margin: '0 auto', // mx-auto equivalent
  maxWidth: theme => theme.breakpoints.values.lg, // container equivalent (adjust breakpoint as needed)
});

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize, // text-xl equivalent
  fontWeight: theme.typography.fontWeightBold, // font-bold equivalent
  marginBottom: theme.spacing(1), // mb-4 equivalent
  [theme.breakpoints.up('md')]: {
    marginBottom: 0, // Reset margin on md and above
  },
}));

const SubtitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize, // text-sm equivalent
}));

const CopyrightTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize, // text-sm equivalent
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    textAlign: 'right', // text-right on md and above
  },
}));

const ApiLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.light, // text-primary-300 equivalent
  '&:hover': {
    textDecoration: 'underline', // hover:underline equivalent
  },
}));

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <FooterContent>
        <Box sx={{ mb: { xs: 2, md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
          <TitleTypography variant="h6" component="h3">
            Country Explorer
          </TitleTypography>
          <SubtitleTypography variant="body2">
            Explore countries around the world
          </SubtitleTypography>
        </Box>
        <Box sx={{ textAlign: 'center', md: 'right' }}>
          <CopyrightTypography variant="body2">
            &copy; {new Date().getFullYear()} Country Explorer
          </CopyrightTypography>
          <SubtitleTypography variant="body2">
            Powered by{' '}
            <ApiLink
              href="https://restcountries.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              REST Countries API
            </ApiLink>
          </SubtitleTypography>
        </Box>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;