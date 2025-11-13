import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

// Simple mock notifications endpoint
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user!.userId;
    
    // Mock notifications based on user's actual data
    // In future, this would query a notifications table
    const mockNotifications = [
      {
        id: '1',
        type: 'upvote',
        userId: userId,
        actorUsername: 'john_doe',
        snippetId: null,
        snippetTitle: 'React Custom Hook',
        message: 'upvoted your snippet',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'comment',
        userId: userId,
        actorUsername: 'jane_smith',
        snippetId: null,
        snippetTitle: 'Python Utility',
        message: 'commented on your snippet',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '3',
        type: 'follow',
        userId: userId,
        actorUsername: 'dev_master',
        snippetId: null,
        snippetTitle: null,
        message: 'started following you',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ];

    res.json({
      success: true,
      data: mockNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response - in future, update database
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { id, read: true },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
    });
  }
});

// Mark all as read
router.put('/read-all', authenticate, async (_req: Request, res: Response) => {
  try {
    // Mock response - in future, update all user notifications
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
    });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (_req: Request, res: Response) => {
  try {
    // Mock response - in future, delete from database
    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
    });
  }
});

// Get unread count
router.get('/unread-count', authenticate, async (_req: Request, res: Response) => {
  try {
    // Mock response - in future, count unread from database
    res.json({
      success: true,
      data: { count: 2 },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
    });
  }
});

export default router;
