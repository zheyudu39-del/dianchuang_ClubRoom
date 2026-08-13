"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  Code,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { departments as mockDepartments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Department, Faq } from "@/lib/db";

const applicationSchema = z.object({
  name: z.string().min(2, "姓名至少 2 个字符"),
  studentId: z.string().min(8, "请输入正确的学号"),
  email: z.string().email("请输入正确的邮箱"),
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入正确的手机号"),
  grade: z.string().min(1, "请选择年级"),
  major: z.string().min(2, "请输入专业"),
  department: z.string().min(1, "请选择意向部门"),
  skills: z.string().min(2, "请填写技能（逗号分隔）"),
  selfIntro: z.string().min(20, "自我介绍至少 20 字"),
  experience: z.string().optional(),
  portfolio: z.string().url("请输入正确的 URL").optional().or(z.literal("")),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const steps = [
  { id: 1, title: "基础信息", icon: User, desc: "让我们认识你" },
  { id: 2, title: "技能 & 部门", icon: Code, desc: "选择你的方向" },
  { id: 3, title: "自我介绍", icon: FileText, desc: "展示你的独特" },
];

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [applicationCode, setApplicationCode] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data: Department[]) => setDepartments(data))
      .catch(() => setDepartments(mockDepartments as unknown as Department[]));
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data: Faq[]) => setFaqs(data))
      .catch(() => setFaqs([]));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["name", "studentId", "email", "phone", "grade", "major"]
        : step === 2
          ? ["department", "skills"]
          : [];
    const valid = await trigger(fields as (keyof ApplicationForm)[]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: ApplicationForm) => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitError(result.error || "提交失败，请稍后重试");
        setSubmitting(false);
        return;
      }
      setApplicationCode(result.code);
      setSubmitted(true);
    } catch {
      setSubmitError("网络错误，请稍后重试");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex w-20 h-20 rounded-full bg-indigo-600 items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-3">
            报名提交成功！
          </h1>
          <p className="text-zinc-500 mb-2">
            我们已收到你的报名信息，招新组会在 3 个工作日内联系你。
          </p>
          <p className="text-sm text-indigo-600 font-mono mb-8">
            报名编号：{applicationCode}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full border border-zinc-300 text-sm text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition"
            >
              返回首页
            </Link>
            <Link
              href="/members"
              className="px-6 py-2.5 rounded-full bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition"
            >
              看看团队
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs text-zinc-500">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            2026 秋季纳新 · 限额 3 人
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-zinc-900">
            加入 <span className="text-indigo-600">典创</span>
          </h1>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            填写下面的表单，告诉我们你是谁，你想做什么。
            <br />
            我们更看重热情与潜力，而不是经验。
          </p>
        </motion.div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: step === s.id ? 1.08 : 1,
                  }}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    step > s.id
                      ? "bg-indigo-600 text-white"
                      : step === s.id
                        ? "border-2 border-indigo-600 bg-white text-indigo-600"
                        : "bg-zinc-100 text-zinc-400",
                  )}
                >
                  {step > s.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" strokeWidth={1.75} />
                  )}
                </motion.div>
                <div className="mt-2.5 text-center">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      step >= s.id ? "text-zinc-900" : "text-zinc-400",
                    )}
                  >
                    {s.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 hidden sm:block">
                    {s.desc}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="w-12 sm:w-24 h-px mx-2 sm:mx-4 mb-8 relative bg-zinc-200 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: step > s.id ? "100%" : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="姓名" error={errors.name?.message}>
                      <input
                        {...register("name")}
                        placeholder="请输入你的姓名"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="学号" error={errors.studentId?.message}>
                      <input
                        {...register("studentId")}
                        placeholder="例如：20240101001"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="邮箱" error={errors.email?.message}>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="手机号" error={errors.phone?.message}>
                      <input
                        {...register("phone")}
                        placeholder="11 位手机号"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="年级" error={errors.grade?.message}>
                      <select {...register("grade")} className={inputClass}>
                        <option value="">请选择</option>
                        <option value="大一">大一</option>
                        <option value="大二">大二</option>
                        <option value="大三">大三</option>
                        <option value="大四">大四</option>
                        <option value="研一">研一</option>
                        <option value="研二">研二</option>
                      </select>
                    </Field>
                    <Field label="专业" error={errors.major?.message}>
                      <input
                        {...register("major")}
                        placeholder="例如：计算机科学与技术"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <Field label="意向部门" error={errors.department?.message}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {departments.map((dept) => (
                        <label
                          key={dept.id}
                          className={cn(
                            "relative flex flex-col p-3 rounded-lg border cursor-pointer transition",
                            getValues("department") === dept.id
                              ? "border-indigo-600 bg-indigo-50"
                              : "border-zinc-200 bg-zinc-50 hover:border-zinc-400",
                          )}
                        >
                          <input
                            type="radio"
                            value={dept.id}
                            {...register("department")}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium text-zinc-900">
                            {dept.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-1 line-clamp-1">
                            {dept.skills.slice(0, 2).join(" / ")}
                          </span>
                          {getValues("department") === dept.id && (
                            <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />
                          )}
                        </label>
                      ))}
                    </div>
                  </Field>

                  <Field
                    label="技能栈"
                    error={errors.skills?.message}
                    hint="多个技能用逗号分隔"
                  >
                    <input
                      {...register("skills")}
                      placeholder="例如：React, TypeScript, Node.js"
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    label="作品集链接（选填）"
                    error={errors.portfolio?.message}
                  >
                    <input
                      {...register("portfolio")}
                      placeholder="GitHub / 个人网站 / 作品链接"
                      className={inputClass}
                    />
                  </Field>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <Field
                    label="自我介绍"
                    error={errors.selfIntro?.message}
                    hint="告诉我们你的故事，为什么想加入 典创"
                  >
                    <textarea
                      {...register("selfIntro")}
                      rows={6}
                      placeholder="例如：我是来自计算机系的大二学生，热衷于前端开发与开源项目..."
                      className={cn(inputClass, "resize-none")}
                    />
                  </Field>

                  <Field
                    label="项目经验（选填）"
                    error={errors.experience?.message}
                  >
                    <textarea
                      {...register("experience")}
                      rows={4}
                      placeholder="介绍你做过的项目、获得的奖项、参与的竞赛..."
                      className={cn(inputClass, "resize-none")}
                    />
                  </Field>

                  <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-4 text-sm text-zinc-600">
                    <p className="font-medium text-indigo-700 mb-1">温馨提示</p>
                    <p>
                      提交后，招新组会在 3
                      个工作日内通过邮件联系你。请关注你的邮箱通知。
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 按钮 */}
            <div className="mt-8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 text-sm text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一步
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  {submitError && (
                    <p className="text-sm text-red-500">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "提交中..." : "提交报名"}
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-center mb-10">
            常见问题
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-zinc-200 bg-white p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium text-zinc-900 list-none">
                  {faq.question}
                  <ChevronRight className="w-4 h-4 text-zinc-400 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
