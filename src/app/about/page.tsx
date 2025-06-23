export default function About() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600">プロフィール文章を作成予定</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <p className="text-gray-600">スキル情報を作成予定</p>
          </section>
        </div>
      </main>
    </div>
  );
}