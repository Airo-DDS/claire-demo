# Claire AI Voice Receptionist Demo

A demonstration dashboard for Claire—an AI voice receptionist for dental practices—built by Haloweave for Airodental. This demo showcases a side-by-side comparison between Elevenlabs and Cartesia voice models integrated via Vapi.

## Technologies Used

- **Framework**: Next.js 15
- **Styling**: Modern, clean UI with dental blue color scheme and Questrial font
- **Backend**: Supabase for authentication and data storage
- **Database**: PostgreSQL via Prisma ORM
- **Voice Integration**: Vapi Web SDK for voice model integration

## Features

- Side-by-side comparison of Elevenlabs and Cartesia voice capabilities
- Interactive voice call simulation with both models
- Demonstration of "seventy one oh one" pronunciation for addresses
- Mock appointment booking workflows
- Call transcripts and performance metrics

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Vapi account with API keys for Elevenlabs and Cartesia

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd claire-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Database URL for Prisma
   DATABASE_URL=your_postgres_connection_string
   DIRECT_URL=your_direct_postgres_connection_string
   
   # Vapi Configuration
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
   ```

4. Initialize and generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Deployment to Vercel

1. Create a Vercel account and connect your GitHub repository.

2. In the Vercel dashboard, create a new project and import your repository.

3. Configure the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`

4. Deploy the project:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Understanding Voice Model Pronunciation

The demo is specifically designed to demonstrate how both voice models handle the pronunciation of addresses containing specific number patterns. For example, the address "7101 Oak Street" should be pronounced as "seventy one oh one Oak Street" rather than "seven thousand one hundred and one Oak Street."

This pronunciation capability is critical for a dental receptionist AI and demonstrates the subtle differences between the voice models.

## Vapi Integration Details

This demo uses the Vapi Web SDK to integrate the voice models. The key configurations include:

1. **Elevenlabs Configuration**:
   - Voice: Rachel (ID: 21m00Tcm4TlvDq8ikWAM)
   - Model: eleven_turbo_v2

2. **Cartesia Configuration**:
   - Voice: Jess

Both models are initialized with the same system prompt to ensure fair comparison.

## Additional Resources

- [Vapi Documentation](https://docs.vapi.ai/introduction)
- [Elevenlabs via Vapi](https://docs.vapi.ai/providers/voice/elevenlabs)
- [Cartesia via Vapi](https://docs.vapi.ai/providers/voice/cartesia)
- [Vapi Web SDK Documentation](https://docs.vapi.ai/sdk/web)

## License

© 2024 Haloweave. All rights reserved.
