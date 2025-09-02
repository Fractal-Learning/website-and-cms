#!/usr/bin/env tsx

import dotenv from 'dotenv'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Load environment variables
dotenv.config()

const states = [
  { state_abbreviation: 'AL', state_name: 'Alabama' },
  { state_abbreviation: 'AK', state_name: 'Alaska' },
  { state_abbreviation: 'AZ', state_name: 'Arizona' },
  { state_abbreviation: 'AR', state_name: 'Arkansas' },
  { state_abbreviation: 'CA', state_name: 'California' },
  { state_abbreviation: 'CO', state_name: 'Colorado' },
  { state_abbreviation: 'CT', state_name: 'Connecticut' },
  { state_abbreviation: 'DE', state_name: 'Delaware' },
  { state_abbreviation: 'FL', state_name: 'Florida' },
  { state_abbreviation: 'GA', state_name: 'Georgia' },
  { state_abbreviation: 'HI', state_name: 'Hawaii' },
  { state_abbreviation: 'ID', state_name: 'Idaho' },
  { state_abbreviation: 'IL', state_name: 'Illinois' },
  { state_abbreviation: 'IN', state_name: 'Indiana' },
  { state_abbreviation: 'IA', state_name: 'Iowa' },
  { state_abbreviation: 'KS', state_name: 'Kansas' },
  { state_abbreviation: 'KY', state_name: 'Kentucky' },
  { state_abbreviation: 'LA', state_name: 'Louisiana' },
  { state_abbreviation: 'ME', state_name: 'Maine' },
  { state_abbreviation: 'MD', state_name: 'Maryland' },
  { state_abbreviation: 'MA', state_name: 'Massachusetts' },
  { state_abbreviation: 'MI', state_name: 'Michigan' },
  { state_abbreviation: 'MN', state_name: 'Minnesota' },
  { state_abbreviation: 'MS', state_name: 'Mississippi' },
  { state_abbreviation: 'MO', state_name: 'Missouri' },
  { state_abbreviation: 'MT', state_name: 'Montana' },
  { state_abbreviation: 'NE', state_name: 'Nebraska' },
  { state_abbreviation: 'NV', state_name: 'Nevada' },
  { state_abbreviation: 'NH', state_name: 'New Hampshire' },
  { state_abbreviation: 'NJ', state_name: 'New Jersey' },
  { state_abbreviation: 'NM', state_name: 'New Mexico' },
  { state_abbreviation: 'NY', state_name: 'New York' },
  { state_abbreviation: 'NC', state_name: 'North Carolina' },
  { state_abbreviation: 'ND', state_name: 'North Dakota' },
  { state_abbreviation: 'OH', state_name: 'Ohio' },
  { state_abbreviation: 'OK', state_name: 'Oklahoma' },
  { state_abbreviation: 'OR', state_name: 'Oregon' },
  { state_abbreviation: 'PA', state_name: 'Pennsylvania' },
  { state_abbreviation: 'RI', state_name: 'Rhode Island' },
  { state_abbreviation: 'SC', state_name: 'South Carolina' },
  { state_abbreviation: 'SD', state_name: 'South Dakota' },
  { state_abbreviation: 'TN', state_name: 'Tennessee' },
  { state_abbreviation: 'TX', state_name: 'Texas' },
  { state_abbreviation: 'UT', state_name: 'Utah' },
  { state_abbreviation: 'VT', state_name: 'Vermont' },
  { state_abbreviation: 'VA', state_name: 'Virginia' },
  { state_abbreviation: 'WA', state_name: 'Washington' },
  { state_abbreviation: 'WV', state_name: 'West Virginia' },
  { state_abbreviation: 'WI', state_name: 'Wisconsin' },
  { state_abbreviation: 'WY', state_name: 'Wyoming' },
]

async function seedStates() {
  console.log('🌱 Starting states seeding process...')

  // Check for required environment variables
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ Missing PAYLOAD_SECRET environment variable')
    console.error('   Please make sure your .env file contains PAYLOAD_SECRET')
    process.exit(1)
  }

  if (!process.env.POSTGRES_URL) {
    console.error('❌ Missing POSTGRES_URL environment variable')
    console.error('   Please make sure your .env file contains POSTGRES_URL')
    process.exit(1)
  }

  try {
    console.log('🔗 Connecting to Payload...')
    console.log('   Using secret:', process.env.PAYLOAD_SECRET ? '✅ Found' : '❌ Missing')
    console.log('   Using database:', process.env.POSTGRES_URL ? '✅ Found' : '❌ Missing')

    const payload = await getPayload({ config })

    // Check if states already exist
    const existingStates = await payload.find({
      collection: 'states',
      limit: 1,
    })

    if (existingStates.totalDocs > 0) {
      console.log('⚠️  States already exist in the database. Skipping seed.')
      console.log(`   Found ${existingStates.totalDocs} existing states.`)
      process.exit(0)
    }

    console.log('📝 Creating 50 US states...')
    let successCount = 0
    let errorCount = 0

    for (const state of states) {
      try {
        await payload.create({
          collection: 'states',
          data: state,
        })
        console.log(`✅ Created: ${state.state_name} (${state.state_abbreviation})`)
        successCount++
      } catch (error) {
        console.error(`❌ Failed to create ${state.state_name}:`, error)
        errorCount++
      }
    }

    console.log('\n🎉 States seeding completed!')
    console.log(`   ✅ Successfully created: ${successCount} states`)
    if (errorCount > 0) {
      console.log(`   ❌ Failed to create: ${errorCount} states`)
    }
    console.log(`   📊 Total states in database: ${successCount}`)
  } catch (error) {
    console.error('💥 Error during states seeding:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run the seeding
seedStates()
