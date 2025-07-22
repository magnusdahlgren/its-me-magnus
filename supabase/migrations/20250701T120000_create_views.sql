-- Drop views if they exist
drop view if exists random_note;
drop view if exists tag_summaries;
drop view if exists untagged_notes;


-- Create random_note view
create view random_note as
select
  id,
  title,
  content,
  image_url,
  is_important,
  created_at,
  updated_at
from notes
order by random()
limit 1;

-- Create tag_summaries view
create view tag_summaries as
select
  notes_tags.tag_id,
  notes.title,
  notes.is_important,
  count(notes_tags.note_id) as notes_count
from notes_tags
join notes on notes_tags.tag_id = notes.id
group by notes_tags.tag_id, notes.title, notes.is_important;

-- Create untagged_notes view
create view untagged_notes as
select
  id,
  title,
  content,
  image_url,
  is_important,
  created_at,
  updated_at
from notes
where id <> '_untagged'
and id not in (
  select note_id from notes_tags
  union
  select tag_id from notes_tags
);

drop view if exists notes_with_tags;
create view notes_with_tags as
select
  n.id as note_id,
  n.title as note_title,
  n.content as note_content,
  n.image_url,
  n.is_important,
  n.is_private,
  n.use_as_tag,
  n.order_tagged_by,
  n.sort_index,
  n.created_at,
  n.updated_at,
  t.id as tag_id,
  t.title as tag_title,
  t.is_important as tag_is_important,
  exists (
    select 1
    from notes_tags nt
    where nt.tag_id = n.id
    limit 1
  ) as has_children
from notes n
left join notes_tags nt on nt.note_id = n.id
left join notes t on t.id = nt.tag_id;

drop view if exists notes_with_child_counts;
create view notes_with_child_counts as
 WITH child_counts AS (
         SELECT notes_tags.tag_id AS note_id,
            count(*) AS number_of_children
           FROM notes_tags
          GROUP BY notes_tags.tag_id
        )
 SELECT notes.id,
    notes.title,
    notes.content,
    notes.image_url,
    notes.is_important,
    notes.created_at,
    notes.updated_at,
    COALESCE(child_counts.number_of_children, 0::bigint) AS number_of_children
   FROM notes
     LEFT JOIN child_counts ON notes.id = child_counts.note_id;

ALTER TABLE notes
ADD COLUMN sort_tagged_by TEXT
  CHECK (sort_tagged_by IN ('index', 'newest', 'oldest'))
  DEFAULT 'newest';