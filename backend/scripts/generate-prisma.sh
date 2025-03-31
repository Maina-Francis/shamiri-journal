
#!/bin/bash
echo "Regenerating Prisma client..."
cd backend
npx prisma generate
echo "Prisma client regenerated successfully!"
