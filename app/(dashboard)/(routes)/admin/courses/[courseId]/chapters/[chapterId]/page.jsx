import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import connectMongoDB from "@/lib/mongodb";
import { Chapter, MuxData } from "@/models/chapter";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import Banner from "@/components/Banner";
import ChapterActions from "./_components/ChapterActions";

export default async function ChapterIdPage({params}) {
  
    // const { userId } = auth();
    // const {chapterId} = params ; 
    // if (!userId) {
    //     return redirect("/");
    // }
    await connectMongoDB();
    const chapter = await Chapter.findById(chapterId);
    const mux = await MuxData.findById(chapter?.muxData);

    if(!chapter){
        return redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
  
    const completionText = `(${completedFields}/${totalFields})`;
    
    const isComplete = requiredFields.every(Boolean);

      
  
    return (
    <>
    {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link 
                        href={`/teacher/courses/${params.courseId}`}
                        className="flex place-items-center text-sm hover:opacity-60 transition mb-6  "
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 "/>
                        Back to course setup page
                    </Link>
                    <div className="flex items-center justify-between w-full ">
                        <div className="flex flex-col gap-y-2  ">
                            <h1 className="text-2xl font-medium">
                                Chapter Creation
                            </h1>
                            <span className="text-sm text-slate-700">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        <ChapterActions
                            disabled={!isComplete}
                            courseId={params.courseId}
                            chapterId={chapterId}
                            isPublished={chapter.isPublished}
                         />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-16 "  >
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={LayoutDashboard}
                            />
                            <h2 className="text-xl">
                                Customize your chapter
                            </h2>
                        </div>
                        <ChapterTitleForm 
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={chapterId}
                        />
                        <ChapterDescriptionForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={chapterId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge
                                icon={Eye}
                            />
                            <h2 className="text-xl">Access Settings</h2>
                        </div>
                        <ChapterAccessForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={chapterId}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={Video}/>
                        <h2 className="text-xl">
                            Add a video
                        </h2>
                    </div>
                    <ChapterVideoForm
                        initialData={chapter}
                        mux={mux}
                        courseId={params.courseId}
                        chapterId={chapterId}
                    />
                </div>
                
            </div>
        </div>
    </>
  )
}
