export const welcomeEmailTemplate = (email: string) => {
  return `
      <main>
        <p>Dear ${email},</p>

        <p>Welcome to Cinemax!✨ We're thrilled to have you join our community of football lovers.</p>

        <p>Explore your personalized dashboard, connect with other football lovers!</p>

        <p>Need assistance? We're here for you. Happy connecting!</p>

        <p>Best,<br>
          Cinemax Team</p>
      </main>
    `;
};
