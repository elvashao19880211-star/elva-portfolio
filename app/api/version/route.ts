// 返回当前部署的 commit hash，调试用
export async function GET() {
  return Response.json({
    commit: 'b5e09070',
    time: new Date().toISOString(),
  });
}
