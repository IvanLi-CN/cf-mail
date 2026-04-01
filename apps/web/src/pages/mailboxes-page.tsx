import { useMemo } from "react";

import { MailboxCreateCard } from "@/components/mailboxes/mailbox-create-card";
import { MailboxList } from "@/components/mailboxes/mailbox-list";
import { MessageList } from "@/components/messages/message-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatGrid } from "@/components/shared/stat-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useCreateMailboxMutation,
  useDestroyMailboxMutation,
  useMailboxesQuery,
} from "@/hooks/use-mailboxes";
import { useMessagesQuery } from "@/hooks/use-messages";

export const MailboxesPage = () => {
  const mailboxesQuery = useMailboxesQuery();
  const messagesQuery = useMessagesQuery();
  const createMailboxMutation = useCreateMailboxMutation();
  const destroyMailboxMutation = useDestroyMailboxMutation();

  const stats = useMemo(() => {
    const mailboxes = mailboxesQuery.data ?? [];
    const active = mailboxes.filter(
      (mailbox) => mailbox.status === "active",
    ).length;
    const destroyed = mailboxes.filter(
      (mailbox) => mailbox.status === "destroyed",
    ).length;
    return [
      { label: "活跃邮箱", value: String(active), hint: "当前仍可收信" },
      { label: "历史销毁", value: String(destroyed), hint: "已清理完成" },
      {
        label: "收件数",
        value: String(messagesQuery.data?.length ?? 0),
        hint: "列表支持多邮箱筛选",
      },
    ];
  }, [mailboxesQuery.data, messagesQuery.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="邮箱控制台"
        description="创建随机或指定邮箱、查看最近收件，并且按 TTL 自动回收所有邮件数据。"
        eyebrow="Mailboxes"
      />
      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <StatGrid stats={stats} />
          <Card>
            <CardHeader>
              <CardTitle>邮箱列表</CardTitle>
              <CardDescription>
                主列表优先展示活跃地址；销毁时会同步清理 Cloudflare
                规则、消息索引和 R2 对象。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mailboxesQuery.data && mailboxesQuery.data.length > 0 ? (
                <MailboxList
                  mailboxes={mailboxesQuery.data}
                  onDestroy={(mailboxId) =>
                    destroyMailboxMutation.mutate(mailboxId)
                  }
                />
              ) : (
                <EmptyState
                  title="暂无邮箱"
                  description="先在右侧创建一个临时邮箱。"
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>最近收件</CardTitle>
              <CardDescription>
                支持跳转到详情查看 HTML、纯文本、附件清单与 raw eml。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messagesQuery.data && messagesQuery.data.length > 0 ? (
                <MessageList messages={messagesQuery.data.slice(0, 8)} />
              ) : (
                <EmptyState
                  title="还没有邮件"
                  description="创建邮箱之后，就可以开始看收件和详情解析。"
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <MailboxCreateCard
            onSubmit={async (values) => {
              await createMailboxMutation.mutateAsync(values);
            }}
            isPending={createMailboxMutation.isPending}
          />
          <Card>
            <CardHeader>
              <CardTitle>工作方式</CardTitle>
              <CardDescription>
                这是偏工具型的控制台：先创建、再观察收件、最后按 TTL
                或手动销毁。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• 随机地址和指定地址都支持。</p>
              <p>• 单邮箱详情会自动筛选该地址的邮件。</p>
              <p>• HTML、纯文本、附件清单和 Raw EML 都在详情页。</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
