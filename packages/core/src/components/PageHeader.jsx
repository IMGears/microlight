'use client'
import React from 'react';
import NextLink from 'next/link';
import { Typography } from '@/components/ui/typography';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';


const BreadcrumbsCustom = function ({ breadcrumbs }) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((b, index) => (
					<React.Fragment key={index}>
						{index > 0 && <BreadcrumbSeparator>›</BreadcrumbSeparator>}
						<BreadcrumbItem>
							{b.href ? (
								<BreadcrumbLink asChild>
									<NextLink href={b.href}>{b.text}</NextLink>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{b.text}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

export default function PageHeader({ header = "PageHeader", RightButtons = null, level='h3', headerLevel=null, breadcrumbs = null }) {
	if(headerLevel)
		level=headerLevel;
	const renderHeader = () => {
		if (React.isValidElement(header)) {
			return header;
		} else if (typeof header === 'string') {
			return <Typography level={level}>{header}</Typography>
		} else if (typeof header === 'object') {
			const headerParts = Object.values(header);
			return (
				<Typography level={level}>
					{headerParts.length === 1 ? (
						<span>{headerParts[0]}</span>
					) : (
						headerParts.map((part, index) => (
							<span key={index} className={index === 1 ? 'opacity-100' : 'opacity-50'}>
								{part}{index < headerParts.length - 1 && ' '}
							</span>
						))
					)}
				</Typography>
			)
		}
		return null;
	};


	return (
		<div
			data-cy='page-header'
			className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1"
		>
			<div className="flex-grow">
				{breadcrumbs && <BreadcrumbsCustom breadcrumbs={breadcrumbs} />}
				{renderHeader()}
			</div>
			{RightButtons && (
				<div className="flex-shrink-0 my-auto">
					{typeof RightButtons === 'function' ? <RightButtons /> : RightButtons}
				</div>
			)}
		</div>
	)
}
