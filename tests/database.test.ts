import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migrations seed the menu and enforce admin permissions in PostgreSQL', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon; create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated;
      grant execute on function auth.uid() to anon, authenticated;
      insert into auth.users values ('11111111-1111-4111-8111-111111111111'), ('22222222-2222-4222-8222-222222222222');
    `);
    await db.exec(
      await readFile(
        new URL(
          '../supabase/migrations/202610010001_catalog_admin.sql',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    await db.exec(
      await readFile(
        new URL(
          '../supabase/migrations/202610010002_brochure_catalog.sql',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    await db.exec(`
      insert into public.user_roles values ('11111111-1111-4111-8111-111111111111', 'owner', true);
      insert into public.products(id,name,category,description,image_url,image_alt,active)
        values ('draft','Private draft','infusions','Not yet released','/images/test.jpg','Test',false);
      insert into public.gallery_items(id,image_url,caption,category,published)
        values ('draft','/images/test.jpg','Private photo','moments',false);
      set role anon;
    `);
    assert.equal(
      (await db.query('select * from public.products')).rows.length,
      7,
    );
    assert.equal(
      (await db.query('select * from public.gallery_items')).rows.length,
      6,
    );
    assert.equal(
      (
        await db.query<{ allowed: boolean }>(
          'select public.is_deezobo_admin() as allowed',
        )
      ).rows[0].allowed,
      false,
    );
    await assert.rejects(db.query('select * from public.user_roles'));
    await assert.rejects(
      db.query(
        "update public.products set name = 'Hacked' where id = 'ginger-hibiscus'",
      ),
    );
    await db.exec(
      "reset role; set role authenticated; set request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';",
    );
    assert.equal(
      (
        await db.query(
          "update public.products set name = 'Hacked' where id = 'ginger-hibiscus' returning id",
        )
      ).rows.length,
      0,
    );
    await assert.rejects(
      db.query(
        "insert into public.user_roles values ('22222222-2222-4222-8222-222222222222','admin',true)",
      ),
    );
    await assert.rejects(
      db.query(
        "insert into public.gallery_items(id,image_url,caption,category) values('attack','/images/x.jpg','x','moments')",
      ),
    );
    await db.exec(
      "set request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';",
    );
    assert.equal(
      (
        await db.query<{ allowed: boolean }>(
          'select public.is_deezobo_admin() as allowed',
        )
      ).rows[0].allowed,
      true,
    );
    assert.equal(
      (await db.query('select * from public.products')).rows.length,
      8,
    );
    assert.equal(
      (
        await db.query(
          "update public.products set featured = false where id = 'ginger-hibiscus' returning id",
        )
      ).rows.length,
      1,
    );
    await assert.rejects(
      db.query(
        `update public.products set options='[{"id":"x","label":"Bottle","priceMinor":-10}]' where id='ginger-hibiscus'`,
      ),
    );
    await assert.rejects(
      db.query(
        `update public.products set options='[{"id":"x","label":"Bottle","priceMinor":5.5}]' where id='ginger-hibiscus'`,
      ),
    );
    await db.exec(
      'reset role; update public.user_roles set active = false; set role authenticated;',
    );
    assert.equal(
      (
        await db.query<{ allowed: boolean }>(
          'select public.is_deezobo_admin() as allowed',
        )
      ).rows[0].allowed,
      false,
    );
    assert.equal(
      (
        await db.query(
          "update public.products set name = 'Revoked' where id = 'ginger-hibiscus' returning id",
        )
      ).rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
