import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

export const testController = {
  test: asyncHandler(async (req: Request, res: Response) => {
    if (req.method === 'GET') {
      console.log('GET endpoint hit!')
      res.json({
        success: true,
        message: 'Backend is working! 🚀',
        timestamp: new Date().toISOString()
      })
      return
    }

    // Handle POST request
    console.log('POST endpoint hit with message:', req.body.message)
    res.json({
      success: true,
      message: 'Message received! 📬',
      data: {
        receivedMessage: req.body.message,
        timestamp: new Date().toISOString()
      }
    })
  })
} 